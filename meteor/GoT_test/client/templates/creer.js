AutoForm.hooks({
  insertBookForm: {
    onSuccess: function (formType, result) {
      Router.go(`/suivre/${result}`);
    }
  }
});
