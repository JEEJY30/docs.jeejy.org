---
title: "Python Basics: Your First Steps 🐍"
date: 2025-07-01T10:00:00Z
draft: false
description: "Learn Python fundamentals with hands-on examples and practical exercises"
tags: ["python", "programming", "beginner"]
categories: ["learning"]
topics: ["programming", "python"]
difficulty: "beginner"
featured_image: "/images/python-tutorial.jpg"
reading_time: 15
---

# Python Basics: Your First Steps 🐍

Welcome to the world of Python programming! This tutorial will guide you through the fundamentals.

## What You'll Learn
- Variables and data types
- Control structures (if/else, loops)
- Functions and modules
- Working with files

## Prerequisites
- Basic computer literacy
- No prior programming experience needed

## Getting Started

### Installing Python

First, let's get Python installed on your system:

```bash
# Check if Python is installed
python --version

# If not installed, visit python.org

# Hello World in Python
print("Hello, World!")

# Variables
name = "JEEJY"
age = 25
is_learning = True

print(f"My name is {name} and I'm {age} years old")

# Numbers
integer_num = 42
float_num = 3.14

# Strings
text = "Hello Python"
multiline = """
This is a
multiline string
"""

# Lists
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]

# Dictionaries
person = {
    "name": "JEEJY",
    "age": 25,
    "skills": ["Python", "Web Dev"]
}

age = 18

if age >= 18:
    print("You're an adult!")
elif age >= 13:
    print("You're a teenager!")
else:
    print("You're a child!")

# For loop
for i in range(5):
    print(f"Count: {i}")

# While loop
count = 0
while count < 3:
    print(f"While count: {count}")
    count += 1

# Loop through a list
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"I like {fruit}")

    def greet(name):
    return f"Hello, {name}!"

def calculate_area(length, width):
    area = length * width
    return area

# Using functions
message = greet("Python Learner")
print(message)

rectangle_area = calculate_area(5, 3)
print(f"Area: {rectangle_area}")

def calculator(num1, num2, operation):
    if operation == "+":
        return num1 + num2
    elif operation == "-":
        return num1 - num2
    elif operation == "*":
        return num1 * num2
    elif operation == "/":
        return num1 / num2 if num2 != 0 else "Cannot divide by zero"
    else:
        return "Invalid operation"

# Test the calculator
result = calculator(10, 5, "+")
print(f"10 + 5 = {result}")