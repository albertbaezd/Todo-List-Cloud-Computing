#!/usr/local/bin/python
# This is a simple example web app that is meant to illustrate the basics.
from flask import Flask, render_template, redirect, g, request, url_for, jsonify
import sqlite3
import os
import sys
import requests
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import re

DATABASE = 'todolist.db'
# Regular expression pattern to validate an email address
email_pattern = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")


# app = Flask(__name__) default 
# app = Flask(__name__, static_folder='/build', static_url_path='/')
app = Flask(__name__, template_folder='build', static_folder='build', static_url_path='/')

app.config.from_object(__name__)

# Encription
bcrypt = Bcrypt(app)
# Allow all domains to access endpoints starting with /api/*
CORS(app, resources={r"/api/*": {"origins": "*"}})

# HW4
@app.route("/")
def show_list():
    api_url = os.environ.get("API_URL")
    if not api_url:
        print("URL environment variable not set: API_URL")
        return 
    # resp = requests.get(f"http://{api_url}/api/items")
    # resp = resp.json()
    # return render_template('index.html', todolist=resp)
    # No need to make an initial fetch here
    return render_template('index.html')

@app.route("/api/items")
def get_items():
    db = get_db()
    cur = db.execute('SELECT what_to_do, due_date, status FROM entries')
    entries = cur.fetchall()
    tdlist = [dict(what_to_do=row[0], due_date=row[1], status=row[2]) for row in entries]
    return jsonify(tdlist)

# Retrieve all todos or a specific todo
@app.route("/api/todos", methods=['GET'])
@app.route("/api/todos/<int:todo_id>", methods=['GET'])
def get_todos(todo_id=None):
    db = get_db()
    if todo_id:
        cursor = db.execute('SELECT id, description, added_date, due_date, status, priority FROM Todo WHERE id = ?', (todo_id,))
        row = cursor.fetchone()
        if row:
            todo = {
                "id": row[0],
                "description": row[1],
                "added_date": row[2],
                "due_date": row[3],
                "status": row[4],
                "priority": row[5]
            }
            return jsonify(todo)
        return jsonify({"error": "Todo not found"}), 404
    else:
        cursor = db.execute('SELECT id, description, added_date, due_date, status, priority FROM Todo')
        todos = cursor.fetchall()
        todo_list = [
            {
                "id": row[0],
                "description": row[1],
                "added_date": row[2],
                "due_date": row[3],
                "status": row[4],
                "priority": row[5]
            }
            for row in todos
        ]
        return jsonify(todo_list)
    

# Retrieve todos by user ID
@app.route('/api/users/<int:user_id>/todos', methods=['GET'])
def get_user_todos(user_id):
    db = get_db()
    cursor = db.execute(
        'SELECT id, description, added_date, due_date, status, priority FROM Todo WHERE user_id = ?',
        (user_id,)
    )
    todos = cursor.fetchall()

    if not todos:
        return jsonify({"error": "No todos found for the given user"}), 404

    todo_list = [
        {
            "id": row[0],
            "description": row[1],
            "added_date": row[2],
            "due_date": row[3],
            "status": row[4],
            "priority": row[5]
        }
        for row in todos
    ]
    return jsonify(todo_list)


# Create a new todo item
@app.route("/api/todos", methods=['POST'])
def create_todo():
    data = request.json
    if 'description' not in data or 'status' not in data or 'user_id' not in data:
        return jsonify({"error": "Missing required fields: 'description', 'status', and/or 'user_id'"}), 400

    db = get_db()
    db.execute(
        'INSERT INTO Todo (description, added_date, due_date, status, priority, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        (
            data['description'],
            data.get('added_date'),
            data.get('due_date'),
            data['status'],
            data.get('priority'),
            data['user_id']
        )
    )
    db.commit()
    return jsonify({"message": "Todo created successfully"}), 201


# Update an existing todo item
@app.route("/api/todos/<int:todo_id>", methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    if 'description' not in data or 'status' not in data or 'user_id' not in data:
        return jsonify({"error": "Missing required fields: 'description', 'status', and/or 'user_id'"}), 400

    db = get_db()
    cursor = db.execute('SELECT id FROM Todo WHERE id = ?', (todo_id,))
    if cursor.fetchone():
        db.execute(
            'UPDATE Todo SET description = ?, added_date = ?, due_date = ?, status = ?, priority = ?, user_id = ? WHERE id = ?',
            (
                data['description'],
                data.get('added_date'),
                data.get('due_date'),
                data['status'],
                data.get('priority'),
                data['user_id'],
                todo_id
            )
        )
        db.commit()
        return jsonify({"message": "Todo updated successfully"})
    return jsonify({"error": "Todo not found"}), 404



# Delete a todo item
@app.route("/api/todos/<int:todo_id>", methods=['DELETE'])
def delete_todo(todo_id):
    user_id = request.args.get("user_id")
    db = get_db()
    cursor = db.execute('SELECT id FROM Todo WHERE id = ? AND user_id = ?', (todo_id, user_id))
    if cursor.fetchone():
        db.execute('DELETE FROM Todo WHERE id = ? AND user_id = ?', (todo_id, user_id))
        db.commit()
        return jsonify({"message": "Todo deleted successfully"})
    return jsonify({"error": "Todo not found or unauthorized action"}), 404

# Endpoint to mark a todo as completed or pending
@app.route("/api/todos/<int:todo_id>/status", methods=['PATCH'])
def update_todo_status(todo_id):
    data = request.json
    new_status = data.get('status')
    user_id = data.get('user_id')

    if new_status not in ['completed', 'pending']:
        return jsonify({"error": "Invalid status. Allowed values: 'completed', 'pending'"}), 400

    db = get_db()
    cursor = db.execute('SELECT id FROM Todo WHERE id = ? AND user_id = ?', (todo_id, user_id))
    if cursor.fetchone():
        db.execute('UPDATE Todo SET status = ? WHERE id = ? AND user_id = ?', (new_status, todo_id, user_id))
        db.commit()
        return jsonify({"message": f"Todo status updated to {new_status}"})
    return jsonify({"error": "Todo not found or unauthorized action"}), 404

# User Registration Endpoint
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json

    # Ensure all mandatory fields are present and non-empty
    if not all(key in data and data[key] for key in ['username', 'password', 'email']):
        return jsonify({"error": "Missing required fields: 'username', 'password', and/or 'email'"}), 400

    # Validate email format
    if not email_pattern.match(data['email']):
        return jsonify({"error": "Invalid email format"}), 400

    # Validate password length (at least 8 characters)
    if len(data['password']) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    # Check if the username already exists
    db = get_db()
    cursor = db.execute('SELECT id FROM Users WHERE username = ?', (data['username'],))
    if cursor.fetchone():
        return jsonify({"error": "Username already exists"}), 409

    # Check if the email already exists
    cursor = db.execute('SELECT id FROM Users WHERE email = ?', (data['email'],))
    if cursor.fetchone():
        return jsonify({"error": "Email already exists"}), 409

    # Hash the password and insert the user
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    db.execute('INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
               (data['username'], hashed_password, data['email']))
    db.commit()
    return jsonify({"message": "User created successfully"}), 201

@app.route("/api/users", methods=['GET'])
def get_all_users():
    db = get_db()
    cursor = db.execute('SELECT id, username, email FROM Users')
    users = cursor.fetchall()
    
    # Retrieve column names from the cursor description
    column_names = [description[0] for description in cursor.description]
    
    # Use a list comprehension to convert tuples to dictionaries
    user_list = [
        {column_names[i]: row[i] for i in range(len(row))}
        for row in users
    ]
    
    return jsonify(user_list)


@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    if 'username' not in data or 'password' not in data:
        return jsonify({"error": "Missing required fields: 'username' and/or 'password'"}), 400

    db = get_db()
    # Modify the query to fetch the username alongside the ID and password
    cursor = db.execute('SELECT id, username, password FROM Users WHERE username = ?', (data['username'],))
    user = cursor.fetchone()

    # Verify that the user exists and the password matches
    if not user or not bcrypt.check_password_hash(user[2], data['password']):
        return jsonify({"error": "Invalid username or password"}), 401

    # Return both user ID and username in the response
    return jsonify({
        "message": "Login successful",
        "user_id": user[0],
        "username": user[1]
    }), 200


# Old Methods
# @app.route("/add", methods=['POST'])
# def add_entry():
#     db = get_db()
#     db.execute('insert into entries (what_to_do, due_date) values (?, ?)',
#                [request.form['what_to_do'], request.form['due_date']])
#     db.commit()
#     return redirect(url_for('show_list'))


# @app.route("/delete/<item>")
# def delete_entry(item):
#     db = get_db()
#     db.execute("DELETE FROM entries WHERE what_to_do='"+item+"'")
#     db.commit()
#     return redirect(url_for('show_list'))


# @app.route("/mark/<item>")
# def mark_as_done(item):
#     db = get_db()
#     db.execute("UPDATE entries SET status='done' WHERE what_to_do='"+item+"'")
#     db.commit()
#     return redirect(url_for('show_list'))


def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = sqlite3.connect(app.config['DATABASE'])
    return g.sqlite_db


@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


if __name__ == "__main__":
    app.run("0.0.0.0", port=80, debug=True)
