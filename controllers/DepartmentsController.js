const { dbObject } = require("../db/db");
const { validationResult } = require("express-validator");
const isAdmin = 1;
let depts,
  users = [];

exports.GetAllDepartments = async (req, res, next) => {
  try {
	    depts = await dbObject.GetAllDepartments();
    users = await dbObject.GetUsersAndDepartments();
    hods = await dbObject.GetAllHODs();

    res.render("admin/department", {
      isAdmin,
      pageTitle: "Departments",
      users,
      depts,
      hods,
      adminName: typeof req.user !== "undefined" ? req.user.fullname : "",
    });
  } catch (error) { 
    next(error);
  }
};

exports.AddNewDepartment = async (req, res, next) => {
  try {
    // depts = await dbObject.GetAllDepartments();
    // users = await dbObject.GetUsersAndDepartments();
    const { departmentName } = req.body;

    //check if the department name does not exist
    const departmentExist = await dbObject.GetDepartmentByName(departmentName);

    if (departmentExist.length) {
      //department exists,send error to the client
      return res.status(201).json({ error: "Department name already exist" });
    } else {
      //does not exist, save to the database
      const CreatedDept = await dbObject.CreateNewDepartment(departmentName);

      //TODO log to the database

      return res.status(200).json({ success: "Department saved successfully" });
    }

    
  } catch (error) {
    next(error);
  }
};

//get department by ID
exports.GetDepartmentById = async (req, res, next) => {
  const id = parseInt(req.params.id);

  const department = await dbObject.GetDepartmentById(id);

  if (department.length) {
    //department exists
    console.log(department);

    return res.status(200).json({ data: department });
  } else {
    //department does not exist
    return res.status(404).json({ error: "DEPARTMENT NOT FOUND" });
  }
};

//update department by ID
exports.UpdateDepartmentById = async (req, res, next) => {
  const { id, departmentName } = req.body;

  console.log(id);

  const department = await dbObject.GetDepartmentById(id);

  if (department.length) {
    //department exist,  update
  } else {
    //deparment does not exist
    return res.status(404).json({ error: "DEPARTMENT NOT FOUND" });
  }
};

//delete department by ID
exports.DeleteDepartmentById = async(req,res,next) => {
  const { id } = req.params;

  //check if department exists
  const departmentExists = await dbObject.GetDepartmentById(id);
  if (Object.keys(departmentExists).length) {
    //delete the department
    await dbObject.deleteDepartmentById(id);
    return res.status(200).json({success:"Department deleted successfully"})
  }

  return res.status(201).json({error:"department does not exist"})
}

//assign department head
exports.AssignHeadOfDepartment = async (req, res, next) => {
  try {
    const { departmentId, hodId } = req.body;

    //get department by HOD id
    const exist = await dbObject.GetDepartmentByHODId(hodId);
    if (Object.keys(exist).length) {
      return res
        .status(201)
        .json({ error: "User can only be HOD for one department" });
    }

    const AssignDept = await dbObject.AssignDepartmentHead(
      parseInt(departmentId),
      parseInt(hodId)
    );
    //TODO log to the database
     await dbObject.InsertIntoSysLog(
        req.user.userId,
        `Assign a new department head with ID: ${AssignDept.insertId}`
      );

    return res
      .status(200)
      .json({ success: "User successfully assigned to department" });

  } catch (error) {
    next(error);
  }
};

exports.DeleteDepartmentByID = async (req, res, next) => {
  try {
    const deptId = parseInt(req.body.deptId);

    const DeletedDept = await dbObject
      .DeleteDepartmentById(deptId)
      .catch((err) => {
        return res.send({ error: err });
      });
    await dbObject.InsertIntoSysLog(
      req.user.userId,
      `Deleted department with ID: ${deptId}`
    );
    if (DeletedDept) {
      return res.send({ message: "Department deleted successfully" });
    } else {
      return res.send({ message: "Error deleting depratment" });
    }
  } catch (error) {
    next(error);
  }
};

exports.GetDepartmentByID = async (req, res, next) => {
  try {
    const deptId = parseInt(req.params.deptId);
    const SingleDept = await dbObject.GetDepartmentByID(deptId).catch((err) => {
      return res.send({ error: err });
    });
    if (SingleDept) {
      return res.send({ data: SingleDept[0] });
    } else {
      return res.send({ data: null });
    }
  } catch (error) {
    next(error);
  }
};

exports.AssignDepartmentHead = async (req, res, next) => {
  try {
    depts = await dbObject.GetAllDepartments();
    users = await dbObject.GetUsersAndDepartments();
    const { department, hod } = req.body;
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.render("admin/department", {
        isAdmin,
        errors,
        pageTitle: "Departments",
        users,
        depts,
        adminName: typeof req.user !== "undefined" ? req.user.fullname : "",
      });
    } else {
      const AssignDept = await dbObject
        .AssignNewDepartment(parseInt(department), parseInt(hod))
        .catch((err) => {
          throw err;
        });
      await dbObject.InsertIntoSysLog(
        req.user.userId,
        `Assign a new department head with ID: ${AssignDept.insertId}`
      );
      req.flash("success", "Head of Department Assigned");
      res.redirect("/admin/department");
    }
  } catch (error) {
    next(error);
  }
};
