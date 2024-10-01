from flask import Flask, render_template, jsonify, request
import json

application = Flask(__name__)

app= application

# Load courses from JSON file
with open('courses.json', 'r') as f:
    courses = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/courses')
def courses_page():
    return render_template('courses.html')

@app.route('/course-details')
def course_details_page():
    return render_template('course-details.html')

@app.route('/enroll')
def enroll_page():
    return render_template('enroll.html')

@app.route('/api/courses')
def get_courses():
    return jsonify(courses)

@app.route('/api/courses/<int:course_id>')
def get_course(course_id):
    course = next((course for course in courses if course['id'] == course_id), None)
    if course:
        return jsonify(course)
    return jsonify({'error': 'Course not found'}), 404

@app.route('/api/enroll', methods=['POST'])
def enroll():
    data = request.json
    course_id = data.get('course')
    name = data.get('name')
    email = data.get('email')
    return jsonify({'message': f'Enrolled {name} ({email}) in course ID: {course_id}'})

if __name__ == '__main__':
    app.run(debug=True)
