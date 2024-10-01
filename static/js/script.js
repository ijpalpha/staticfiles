// Function to fetch courses from the backend
async function fetchCourses() {
    const response = await fetch('/api/courses');
    const courses = await response.json();
    return courses;
}

// Populate course list on courses.html
document.addEventListener('DOMContentLoaded', async function() {
    const courseList = document.getElementById('course-list');
    if (courseList) {
        const courses = await fetchCourses();
        courses.forEach(course => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="course-details?id=${course.id}">${course.name}</a>`;
            courseList.appendChild(li);
        });
    }

    // Populate course details on course-details.html
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    if (courseId) {
        const response = await fetch(`/api/courses/${courseId}`);
        const course = await response.json();
        const courseDetails = document.getElementById('course-details');
        if (courseDetails) {
            courseDetails.innerHTML = `
                <h2>${course.name}</h2>
                <p>${course.description}</p>
                <a href="enroll?courseId=${course.id}">Enroll in this course</a>
            `;
        }
    }

    // Populate course options in enroll.html
    const courseSelect = document.getElementById('course');
    if (courseSelect) {
        const courses = await fetchCourses();
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    }

    // Handle form submission on enroll.html
    const enrollForm = document.getElementById('enroll-form');
    if (enrollForm) {
        enrollForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(enrollForm);
            const data = {
                course: formData.get('course'),
                name: formData.get('name'),
                email: formData.get('email')
            };
            const response = await fetch('/api/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert(result.message);
        });
    }
});
