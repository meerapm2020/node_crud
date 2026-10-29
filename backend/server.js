const http=require('http');
let students=[
    {
        id:1,
        name:"Anjali",
        age:24,
        course:"MERN"
    },
     {
        id:2,
        name:"Ajay",
        age:23,
        course:"Python"
    },
];
const server=http.createServer((req,res)=>{
   
    res.setHeader("Content-Type","application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle browser preflight request
    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
    }

    //GET- Get all students

    if(req.url==='/getStudents' && req.method==="GET"){
         res.statusCode=200;
         res.end(JSON.stringify({
            message:"Students data fetched successfully",
            students:students
         }))
    }   
    //Get students by id
    else if(req.url.startsWith('/getStudents/') && req.method==="GET"){
        //console.log(req.url.split('/'));
        const id=parseInt(req.url.split('/')[2]);
       //console.log(id)
       const student=students.find((student)=>student.id===id);
       if(!student){
        res.statusCode=404;
        res.end(JSON.stringify({
            message:"Student not found"
        }));
        return;
       }
       res.statusCode=200;
       res.end(JSON.stringify({
            message:"Student found",
            student:student
        }));
    }  

    //add student=POST

    else if(req.url==='/addStudent' && req.method==="POST"){
        let body="";
        req.on("data",(chunk)=>{
            body+=chunk.toString();
        });
        req.on("end",()=>{
            const newStudent=JSON.parse(body);
            const student={
                id:students.length+1,
                name:newStudent.name,
                age:newStudent.age,
                course:newStudent.course
            };
            students.push(student);
            res.statusCode=201;
        res.end(JSON.stringify({
            message:"Student added successfully",
            student:student
        }))
        });      
    }

    //update a student=put
    else if(req.url.startsWith('/updateStudent/') && req.method==="PUT"){
         const id=parseInt(req.url.split('/')[2]);
         let body="";
         req.on("data",(chunk)=>{
            body+=chunk.toString();
         });
         req.on("end",()=>{
            const updateData=JSON.parse(body);
            const studentIndex=students.findIndex((student)=>student.id===id);
            if(studentIndex===-1){
                res.statusCode=404;
                res.end(JSON.stringify({
                    message:"Student not found"
                }));
                return;
            }
            students[studentIndex].name=updateData.name;
            students[studentIndex].age=updateData.age;
            students[studentIndex].course=updateData.course;
            res.statusCode=200;
            res.end(JSON.stringify({
                message:"Student data updated successfully",
                student:students[studentIndex]
            }))
         })
    }

    //delete a student-DELETE
    else if(req.url.startsWith('/deleteStudent/') && req.method==="DELETE"){
         const id=parseInt(req.url.split('/')[2]);
        const studentIndex=students.findIndex((student)=>student.id===id);
         if(studentIndex===-1){
                res.statusCode=404;
                res.end(JSON.stringify({
                    message:"Student not found"
                }));
                return;
            }

            const deletedStudent=students.splice(studentIndex,1);
               res.statusCode=200;
            res.end(JSON.stringify({
                message:"Student data deleted successfully",
                student:deletedStudent[0],
            }))
    }
    //invalid route
    else{
        res.statusCode=404;
        res.end(JSON.stringify({
                    message:"Route not found"
                }));
    }



});


server.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
})