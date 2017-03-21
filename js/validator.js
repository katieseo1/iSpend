var transactionForm = function () {
  $('#addTransactionForm').bootstrapValidator({
    container: '#messageTransaction',
    fields: {
      amount: {
        validators: {
          notEmpty: {
            message: 'It cannot be empty'
          },
          numeric: {
            message: 'Please enter purchase price'
          }
        }
      },
      description: {
        validators: {
          notEmpty: {
            message: 'The  name is required and cannot be empty'
          }
        }
      },
      purchaseDate: {
        validators: {
          notEmpty: {
            message: 'The  name is required and cannot be empty'
          }
        }
      }
    }
  }).on('success.field.fv', function (e, data) {
    if (data.fv.getInvalidFields().length > 0) {
      data.fv.disableSubmitButtons(true)
    }
  })
}

var signUpForm = function () {
  $('#signup-form').bootstrapValidator({
    container: '#messages',
    fields: {
      firstname: {
        validators: {
          notEmpty: {
            message: 'The  name is required and cannot be empty'
          },
          stringLength: {
            min: 2,
            message: 'The  name must be greater than 2 characters'
          }
        }
      },
      lastname: {
        validators: {
          notEmpty: {
            message: 'The  name is required and cannot be empty'
          },
          stringLength: {
            min: 2,
            message: 'The  name must be greater than 2 characters'
          }
        }
      },
      email: {
        validators: {
          notEmpty: {
            message: 'The email/username cannot be empty'
          },
          stringLength: {
            min: 2,
            message: 'The email/username must be greater than 2 characters'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: 'The password is required and cannot be empty'
          },
          stringLength: {
            min: 6,
            message: 'The password must be greater than 6 characters'
          }
        }
      },
      confirmPassword: {
        validators: {
          notEmpty: {
            message: 'The password is required and cannot be empty'
          },
          identical: {
            field: 'password',
            message: 'The password and its confirm are not the same'
          }
        }
      }
    }
  }).on('success.field.fv', function (e, data) {
    if (data.fv.getInvalidFields().length > 0) { // There is invalid field
      data.fv.disableSubmitButtons(true)
    }
  })
}
var setBudgetForm = function() {
  $('#setBudget').bootstrapValidator({
    container: '#messagesBudget',
    fields: {
      newBudget: {
        validators: {
          numeric: {
            message: 'Please enter amount'
          }
        }
      }
    }
  }).on('success.field.fv', function(e, data) {
    if (data.fv.getInvalidFields().length > 0) {
      data.fv.disableSubmitButtons(true);
    }
  });
}
exports.transactionForm = transactionForm
exports.signUpForm = signUpForm
exports.setBudgetForm = setBudgetForm
