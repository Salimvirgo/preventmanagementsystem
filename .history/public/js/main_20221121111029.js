$(document).ready(function () {
  const displayMessage = (response) => {
    if (response.success) {
      return swal({
        title: "Success",
        text: response.success,
        icon: "success",
        buttons: true,
      }).then((confirm) => {
        if (confirm) {
          location.reload();
        }
      });
    }

    if (response.error) {
      return swal({
        title: "Error",
        text: response.error,
        icon: "error",
        buttons: true,
      });
    }
  };
  let isUserUpdate = false;
  let userID = 0;
  let btnDeleteUsers = document.querySelectorAll("#btnDeleteUsers");
  let btnDeleteVehicle = document.querySelectorAll("#btnDeleteVehicle");
  let btnEditUsers = document.querySelectorAll("#btnEditUsers");
  let btnEditVehicle = document.querySelectorAll("#btnEditVehicle");
  let btnDeleteDepartment = document.querySelectorAll(".btnDeleteDepartment");
  let btnMakeVehicleAvailable = document.querySelectorAll(
    "#btnMakeVehicleAvailable"
  );

  //delete vehicles
  btnDeleteVehicle.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const vehicleId = e.currentTarget.getAttribute("data-vehicleId");

      swal({
        title: "Are you sure?",
        text: "If you delete this vehicle, all request related this vehicle would also be deleted",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          $.ajax({
            url: `/admin/vehicles/delete/${vehicleId}`,
            method: "DELETE",
            success: (response) => {
              displayMessage(response);
            },
            failure: (response) => {
              console.log(response);
            },
          });
        }
      });
    });
  });

  //edit vehicles
  btnEditVehicle.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const vehicleId = e.currentTarget.getAttribute("data-vehicleId");
      alert(vehicleId);
    });
  });
  //make vehicle available
  btnMakeVehicleAvailable.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-vehicleId");

      $.ajax({
        url: `/admin/vehicles/${id}/available/`,
        method: "PATCH",
        success: (response) => {
          displayMessage(response);
        },
        failure: (response) => {
          console.log(response);
        },
      });
    });
  });

  //deletes department
  btnDeleteDepartment.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      userID = e.currentTarget.getAttribute("data-deptid");
      swal({
        title: "Are you sure?",
        text: "If you delete this deparment, all users related this department would also be deleted",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          $.ajax({
            url: `/admin/departments/${userID}`,
            method: "DELETE",
            success: (response) => {
              displayMessage(response);
            },
            failure: (response) => {
              console.log(response);
            },
          });
        }
      });
    });
  });

  //deletes user
  btnDeleteUsers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-userid");

      swal({
        title: "Are you sure?",
        text: "If you delete this user, all related information would also be deleted",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          $.ajax({
            url: `/admin/users/${id}`,
            method: "DELETE",
            success: (response) => {
              displayMessage(response);
            },
            failure: (response) => {
              console.log(response);
            },
          });
        }
      });
    });
  });

  //edit users
  btnEditUsers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      userID = e.currentTarget.getAttribute("data-userid");
      $.ajax({
        url: `/admin/users/${userID}`,
        method: "GET",
        success: (response) => {
          const { data } = response;
          console.log(data);
          const user = data.pop();
          const { fullname, username, email, number, department, userLevel } =
            user;
          $("#fullname").val(fullname);
          $("#username").val(username);
          $("#email").val(email);
          $("#number").val(number);
          $("#department").val(department);
          $("#userLevel").val(userLevel);
          isUserUpdate = true;
          $("#password").attr("disabled", "disabled");
          $("#confirmPassword").attr("disabled", "disabled");
          $("#btn-saveUser").html("Update User");
        },
        failure: (response) => {
          console.log(response);
        },
      });
    });
  });

  //add new user
  $("#saveUserForm").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let errors = [];

    let form = $(this);
    let inputs = form.find(["input", "select", "textarea"]);

    //retrive data from the form being submitted
    const fullname = $("#fullname").val();
    const username = $("#username").val();
    const email = $("#email").val();
    const number = $("#number").val();
    const department = $("#department").val();
    const userLevel = $("#userLevel").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();

    if (!isUserUpdate) {
      //validate users data
      if (fullname === "") {
        errors.push("Fullname is required");
      } else if (fullname.length < 3) {
        errors.push("Fullname must be between 3 and 50 characters");
      }

      if (username === "") {
        errors.push("username is required");
      } else if (username.length < 3) {
        errors.push("Username must be between 3 and 50 characters");
      }

      if (email === "") {
        errors.push("email is required");
      } else if (email.length < 3 || email.length > 200) {
        errors.push("Email must be between 3 and 200 characters");
      }

      if (number === "") {
        errors.push("phone number is required");
      } else if (number.length < 9 || number.length > 20) {
        errors.push("phone number must be between 9 and 20 characters");
      }

      if (department === "") {
        errors.push("department is required");
      } else if (isNaN(department)) {
        errors.push("select a valid department");
      }

      if (userLevel === "") {
        errors.push("user level is required");
      } else if (isNaN(department)) {
        errors.push("select a valid user level");
      }

      if (password === "") {
        errors.push("password is required");
      } else if (password.length < 8 || number.length > 50) {
        errors.push("password must be between 8 and 50 characters");
      } else if (password.toLowerCase() === username.toLowerCase) {
        errors.push("password must not be the same as username");
      }

      if (confirmPassword === "") {
        errors.push("confirm password is required");
      } else if (confirmPassword !== password) {
        errors.push("passwords don't match");
      }
      if (errors.length) {
        console.log("Errors", errors);
        let html = "";

        errors.forEach((error) => {
          console.log(error);
        });
      } else {
        //create new user object
        const user = {
          fullname,
          username,
          email,
          number,
          department,
          userLevel,
          password,
          confirmPassword,
        };

        //send post request to the server
        $.ajax({
          url: "/admin/users",
          method: "POST",
          data: user,
          success: (response) => {
            displayMessage(response);
          },
          failure: (response) => {
            console.log(response);
          },
        });
      }
    } else {
      //validate data and update user record in database
      if (fullname === "") {
        errors.push("Fullname is required");
      } else if (fullname.length < 3) {
        errors.push("Fullname must be between 3 and 50 characters");
      }

      if (username === "") {
        errors.push("username is required");
      } else if (username.length < 3) {
        errors.push("Username must be between 3 and 50 characters");
      }

      if (email === "") {
        errors.push("email is required");
      } else if (email.length < 3 || email.length > 200) {
        errors.push("Email must be between 3 and 200 characters");
      }

      if (number === "") {
        errors.push("phone number is required");
      } else if (number.length < 9 || number.length > 20) {
        errors.push("phone number must be between 9 and 20 characters");
      }

      if (department === "") {
        errors.push("department is required");
      } else if (isNaN(department)) {
        errors.push("select a valid department");
      }

      if (userLevel === "") {
        errors.push("user level is required");
      } else if (isNaN(department)) {
        errors.push("select a valid user level");
      }

      if (errors.length) {
        console.log("Errors", errors);
        let html = "";

        errors.forEach((error) => {
          console.log(error);
        });
      } else {
        //create new user object
        const user = {
          fullname,
          username,
          email,
          number,
          department,
          userLevel,
        };

        //send put request to the server
        $.ajax({
          url: `/admin/users/${userID}`,
          method: "PUT",
          data: user,
          success: (response) => {
            displayMessage(response);
          },
          failure: (response) => {
            console.log(response);
          },
        });
      }
    }
  });

  $("#frmApproveRequest").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const vehicleId = $("#vehicleId").val();
    const requestId = $("#frmApproveRequest").attr("data-reqId");

    //send request to the server
    $.ajax({
      url: "/admin/accept/request",
      method: "POST",
      data: {
        vehicleId,
        requestId,
      },
      success: (response) => {
        displayMessage(response);
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  //HOD Approve Request
  $("#frmHODApproveRequest").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const requestId = $("#frmHODApproveRequest").attr("data-reqId");

    //send request to the server
    $.ajax({
      url: "/accept/request",
      method: "POST",
      data: {
        requestId,
      },
      success: (response) => {
        displayMessage(response);
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  //add new department
  $("#frmSaveDepartment").on("submit", (e) => {
    e.preventDefault();
    let errors = [];

    let form = $(this);
    let inputs = form.find(["input", "select", "textarea"]);

    //retrive data from the form being submitted
    const departmentName = $("#departmentName").val();

    if (departmentName === "") {
      errors.push("Enter department name");
    } else if (departmentName.length < 5 || departmentName.length > 50) {
      errors.push("Department name must be between 5 - 50 characters");
    }

    if (errors.length) {
      console.log(errors);
      return;
      // let html = "";

      // errors.forEach((error) => {
      //   html += `
      //       <div class="alert alert-danger alert-dismissible fade show" role="alert">
      //                           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      //                               <span aria-hidden="true">&times;</span>
      //                               <span class="sr-only">Close</span>
      //                           </button>
      //                          <strong>${error}</strong>
      //                       </div>

      //   `;
      // });
      // document.getElementById("errorContainer").innerHTML = html;
      // return;
    }

    // inputs.props("disabled", true);
    //send request to the server to save the vehicle
    $.ajax({
      url: "/admin/departments",
      method: "POST",
      data: {
        departmentName,
      },
      success: (response) => {
        displayMessage(response);
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  //assign department head
  $("#frmAssignDepartmentHead").on("submit", (e) => {
    e.preventDefault();
    let errors = [];

    let form = $(this);
    let inputs = form.find(["input", "select", "textarea"]);

    //retrive data from the form being submitted
    const departmentId = $("#departmentId").val();
    const hodId = $("#hodId").val();

    if (departmentId === "") {
      errors.push("Please select department");
    }

    if (hodId === "") {
      errors.push("Please select user");
    }

    if (errors.length) {
      console.log(errors);
      return;
      // let html = "";

      // errors.forEach((error) => {
      //   html += `
      //       <div class="alert alert-danger alert-dismissible fade show" role="alert">
      //                           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      //                               <span aria-hidden="true">&times;</span>
      //                               <span class="sr-only">Close</span>
      //                           </button>
      //                          <strong>${error}</strong>
      //                       </div>

      //   `;
      // });
      // document.getElementById("errorContainer").innerHTML = html;
      // return;
    }

    // inputs.props("disabled", true);
    //send request to the server to save the vehicle
    $.ajax({
      url: "/admin/assign-hod",
      method: "POST",
      data: {
        departmentId,
        hodId,
      },
      success: (response) => {
        displayMessage(response);
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  //saves new request
  $("#frmSubmitRequest").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let errors = [];

    //retrive form values
    const eventTitle = $("#eventTitle").val();
    const eventDate = $("#eventDate").val();
    const eventType = $("#eventType").val();
    const eventVenue = $("#venue").val();
    const mediaType = $("input[type=checkbox]:checked")
      .map(function (_, el) {
        return $(el).val();
      })
      .get();
    const numberOfPrint = $("#numberOfPrint").val();
    const numberOfRadio = $("#numberOfRadio").val();
    const numberOfTv = $("#numberOfTv").val();
    const eventBudget = $("#budget").val();

    // create new request object
    const prrequest = {
      eventTitle,
      eventDate,
      eventType,
      eventVenue,
      mediaType,
      numberOfPrint,
      numberOfRadio,
      numberOfTv,
      value,
      eventBudget,
    };
    console.log(prrequest);
    const today = moment(new Date()).format("DD/MM/YYYY");
    const ed = moment(new Date(eventDate)).format("DD/MM/YYYY");

    if (
      moment(ed, "DD/MM/YYYY", false).isBefore(
        moment(today, "DD/MM/YYYY", false)
      )
    ) {
      alert("Event date must be set a after today");
      return;
    }

    // let timeDifference = new Date(departureDate) - new Date();
    let timeDifference = moment(eventDate) - moment();

    const hourDiff = Math.ceil(timeDifference / 60 / 60 / 1000);

    // if (tripPurpose === "Internal" && hourDiff < 2) {
    //   //provincial request should be sent 2 hours earlier before leaving
    //   alert(
    //     "all internal requests should be sent 2 hours ahead of departure time"
    //   );
    //   return;
    // }
    if (hourDiff < 120) {
      //All PR request should be sent 5 Days earlier before Event
      alert("All PR requests should be made 5 days before Event Date");
      return;
    }

    $.ajax({
      url: "/request/new",
      method: "POST",
      // dataType: "json",
      data: prrequest,
      success: (response) => {
        console.log(response);
        displayMessage(response);
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  //saves new Feedback
  $("#frmSubmitFeedback").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    //retrive form values
    const feedback = $("#userFeedback").val();

    const today = moment(new Date()).format("DD/MM/YYYY");

    $.ajax({
      url: "/feedback",
      method: "POST",
      data: {
        today,
        feedback,
      },
      success: (response) => {
        console.log(response);
        displayMessage(response);
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  //sends filter resquest
  $("#frmReportFilter").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const filterStartDate = $("#filterStartDate").val();
    const filterEndDate = $("#filterEndDate").val();
    const filterPurpose = $("#filterPurpose").val();
    const filterStatus = $("#filterStatus").val();

    //data validation
    if (filterStartDate === "") {
      alert("Select From Date");
      return;
    }

    if (filterEndDate === "") {
      alert("Select To Date");
      return;
    }

    if (moment(filterEndDate).isBefore(moment(filterStartDate))) {
      return alert("From date must be greater than TO date");
    }

    $.ajax({
      url: `/admin/report?filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}&filterPurpose=${filterPurpose}&filterStatus=${filterStatus}`,
      method: "GET",
      success: (response) => {
        const { data } = response;
        let tr = "";
        data.forEach((d) => {
          tr += `
              <tr>
                <td scope="col" class="text-center">
                                                  ${d.fullname}
                                            </td>
                                          <td scope="col" class="text-cented">
                                              ${d.deptname}
                                          </td>
                                          <td scope="col" class="text-center">
                                              ${d.requestDate} 
                                          </td>
                                          <td scope="col" class="text-center">
                                              ${d.requestTime} 
                                          </td> 
                                          <td scope="col" class="text-center">
                                              ${d.departureDate} 
                                          </td>
                                          <td scope="col" class="text-center">
                                              ${d.departureTime}
                                          </td>
                                          <td scope="col" class="text-center">
                                              ${d.returnDate} 
                                          </td>
                                          <td scope="col" class="text-center">
                                              ${d.returnTime} 
                                          </td>
                                          <td scope="col" class="text-center">
                                              ${d.tripPurpose} 
                                          </td>
                                          <td scope="col" class="text-center">
                                              ${d.numberOfPassengers} 
                                          </td>
                                          <td scope="col" class="text-center">
                                              <span class="badge badge-warning badge-pill w-100 p-2">
                                                  ${d.requestStatus} 
                                              </span>
                                          </td>
              </tr>
            `;
        });

        document.getElementById("filterResult").innerHTML = "";
        document.getElementById("filterResult").innerHTML = tr;
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  //saves new driver
  $("#frmDriver").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    //get all necessary data
    const driverName = $("#driverName").val();
    const driverId = $("#driverId").val();
    const vehicleRegNumber = $("#vehicleRegNumber").val();
    const driverPhone = $("#driverPhone").val();
    const driverEmail = $("#driverEmail").val();
    const driverStatus = $("#driverStatus").val();

    if (driverName === "") {
      alert("Driver name is required");
      return;
    }
    if (driverId === "") {
      alert("Driver ID is required");
      return;
    }
    if (vehicleRegNumber === "") {
      alert("Select driver's vehicle");
      return;
    }
    if (driverPhone === "") {
      alert("Provide driver's phone number");
      return;
    }

    $.ajax({
      url: "/admin/drivers",
      method: "POST",
      data: {
        driverName,
        driverId,
        vehicleRegNumber,
        driverPhone,
        driverEmail,
        driverStatus,
      },
      success: (response) => {
        displayMessage(response);
      },
      failure: (response) => {
        console.log(response);
      },
    });
  });

  // Setup - add a text input to each footer cell
  $("#filterResultTable thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#filterResultTable thead");

  var table = $("#filterResultTable").DataTable({
    dom: "Bfrtip",
    responsive: true,
    buttons: ["excelHtml5"],
    lengthMenu: [
      [2, 4, 10, -1],
      [2, 4, 10, "All"],
    ],
    pageLength: 10,
    orderCellsTop: true,
    fixedHeader: true,
    initComplete: function () {
      var api = this.api();

      // For each column
      api
        .columns()
        .eq(0)
        .each(function (colIdx) {
          // Set the header cell to contain the input element
          var cell = $(".filters th").eq(
            $(api.column(colIdx).header()).index()
          );
          var title = $(cell).text();
          $(cell).html('<input type="text" placeholder="' + title + '" />');

          // On every keypress in this input
          $(
            "input",
            $(".filters th").eq($(api.column(colIdx).header()).index())
          )
            .off("keyup change")
            .on("keyup change", function (e) {
              e.stopPropagation();

              // Get the search value
              $(this).attr("title", $(this).val());
              var regexr = "({search})"; //$(this).parents('th').find('select').val();

              var cursorPosition = this.selectionStart;
              // Search the column for that value
              api
                .column(colIdx)
                .search(
                  this.value != ""
                    ? regexr.replace("{search}", "(((" + this.value + ")))")
                    : "",
                  this.value != "",
                  this.value == ""
                )
                .draw();

              $(this)
                .focus()[0]
                .setSelectionRange(cursorPosition, cursorPosition);
            });
        });
    },
  });

  // $("#filterResultTable").DataTable({
  //   dom: "Bfrtip",
  //   responsive: true,
  //   buttons: ["excelHtml5"],
  //   lengthMenu: [
  //     [2, 4, 10, -1],
  //     [2, 4, 10, "All"],
  //   ],
  //   pageLength: 10,
  // });
  $("#usersTable").DataTable({
    responsive: true,
    lengthMenu: [
      [2, 4, 5, -1],
      [2, 4, 5, "All"],
    ],
    pageLength: 5,
  });

  $("#pendingRequestsTable").DataTable();
  $("#acceptedRequestsTable").DataTable();
  $("#rejectedRequestsTable").DataTable();
});
