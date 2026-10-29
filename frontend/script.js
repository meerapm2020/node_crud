const API_URL = "http://localhost:3000/students";

// GET ALL STUDENTS


async function getStudents() {

    try {

        const response = await fetch("http://localhost:3000/getStudents");

        const data = await response.json();

        displayStudents(data.students);

    } catch (error) {

        console.log(error);

        alert("Unable to connect to server");

    }
}


// DISPLAY STUDENTS


function displayStudents(students) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.age}</td>

            <td>${student.course}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(
                        ${student.id},
                        '${student.name}',
                        ${student.age},
                        '${student.course}'
                    )">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>
        `;

        table.appendChild(row);

    });
}



// ADD / UPDATE STUDENT

async function saveStudent() {

    const id = document.getElementById("studentId").value;

    const name = document.getElementById("name").value;

    const age = document.getElementById("age").value;

    const course = document.getElementById("course").value;


    // Validation

    if (name === "" || age === "" || course === "") {

        alert("Please fill all fields");

        return;
    }


    const studentData = {

        name: name,

        age: Number(age),

        course: course

    };


    try {

        let response;


        // UPDATE

        if (id !== "") {

            response = await fetch(`http://localhost:3000/updateStudent/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)

            });

        }

        // ADD

        else {

            response = await fetch('http://localhost:3000/addStudent', {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)

            });

        }


        const data = await response.json();

        alert(data.message);

        clearForm();

        getStudents();

    } catch (error) {

        console.log(error);

        alert("Something went wrong");

    }
}



// EDIT STUDENT


function editStudent(id, name, age, course) {

    document.getElementById("studentId").value = id;

    document.getElementById("name").value = name;

    document.getElementById("age").value = age;

    document.getElementById("course").value = course;

    document.getElementById("saveBtn").innerText =
        "Update Student";
}



// DELETE STUDENT


async function deleteStudent(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this student?");


    if (!confirmDelete) {

        return;

    }


    try {

        const response = await fetch(
            `http://localhost:3000/deleteStudent/${id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();

        alert(data.message);

        getStudents();

    } catch (error) {

        console.log(error);

        alert("Unable to delete student");

    }
}


// ==========================
// CLEAR FORM
// ==========================

function clearForm() {

    document.getElementById("studentId").value = "";

    document.getElementById("name").value = "";

    document.getElementById("age").value = "";

    document.getElementById("course").value = "";

    document.getElementById("saveBtn").innerText =
        "Add Student";
}


// ==========================
// BUTTON EVENTS
// ==========================

document
    .getElementById("saveBtn")
    .addEventListener("click", saveStudent);


document
    .getElementById("clearBtn")
    .addEventListener("click", clearForm);


document
    .getElementById("refreshBtn")
    .addEventListener("click", getStudents);


// Load students when page opens

getStudents();

