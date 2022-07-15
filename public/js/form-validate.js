$(document).ready(() => {
  const requestForm = $("#requestForm");
  if (document.body.contains(requestForm)) {
    requestForm.validate({
      rules: {
        EventDate: {
          required: true,
          date: true,
        },
      },

      messages: {
        departureDate: {
          required: "Please select departure date",
          date: "Must be a valid date",
        },
        returnDate: {},
      },
    });
  }
});
