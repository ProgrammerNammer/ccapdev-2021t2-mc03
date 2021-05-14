$(document).ready(function () {
  /*
    TODO:   The code below attaches a `keyup` event to `#refno` text field.
            The code checks if the current reference number entered by the user
            in the text field does not exist in the database.

            If the current reference number exists in the database:
            - `#refno` text field background color turns to red
            - `#error` displays an error message `Reference number already in
            the database`
            - `#submit` is disabled

            else if the current reference number does not exist in the
            database:
            - `#refno` text field background color turns back to `#E3E3E3`
            - `#error` displays no error message
            - `#submit` is enabled
    */
  $("#refno").keyup(function () {
    const errorParagraph = $("#error");
    const refnoField = $("#refno");
    const submitField = $("#submit");
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    async function checkRefNoAvailability() {
      await fetch(
        `http://localhost:9090/getCheckRefNo?${new URLSearchParams(
          {
            refno: refnoField.val(),
          },
          {
            headers: myHeaders,
          }
        ).toString()}`
      ).then((res) => {
        switch (res.status) {
          case 200:
            refnoField.css("background-color", "#E3E3E3");
            errorParagraph.text("");
            submitField.prop("disabled", false);
            break;
          case 409:
            refnoField.css("background-color", "red");
            errorParagraph.text("Reference number already in the database");
            submitField.prop("disabled", true);
            return 409;
            break;
          default:
            //  ERROR
            console.log(res.status);
            return false;
        }
      });
    }

    //  All Logic Here
    checkRefNoAvailability();
  });

  /*
    TODO:   The code below attaches a `click` event to `#submit` button.
            The code checks if all text fields are not empty. The code
            should communicate asynchronously with the server to save
            the information in the database.

            If at least one field is empty, the `#error` paragraph displays
            the error message `Fill up all fields.`

            If there are no errors, the new transaction should be displayed
            immediately, and without refreshing the page, after the values
            are saved in the database.

            The name, reference number, and amount fields are reset to empty
            values.
    */
  $("#submit").click(function () {
    const formToBeSubmitted = $("#payment_form")[0];
    const errorParagraph = $("#error");
    const nameField = formToBeSubmitted[0];
    const refnoField = formToBeSubmitted[1];
    const amountField = formToBeSubmitted[2];

    //  All Logic Here
    if (
      nameField.value !== "" &&
      refnoField.value !== "" &&
      amountField.value !== ""
    ) {
      const myHeaders = new Headers();
      const formData = new URLSearchParams({
        name: nameField.value,
        refno: refnoField.value,
        amount: amountField.value,
      }).toString();

      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      async function submitForm(formData, myHeaders) {
        await fetch(`http://localhost:9090/add?${formData}`, {
          headers: myHeaders,
        }).then((response) => {
          const cards = $("#cards");
          cards.append(
            `<div class="card"> <img src="/images/icon.webp" class="icon"> <div class="info"> <p class="text"> ${nameField.value} </p> <p class="text"> ${refnoField.value} </p> <p class="text"> Php ${amount.value} </p> </div> <button class="remove"> X </button> </div>`
          );

          //    Clearing Form
          nameField.value = "";
          refnoField.value = "";
          amountField.value = "";
          errorParagraph.text("");
        });
      }

      submitForm(formData, myHeaders);
    } else {
      errorParagraph.text("Fill up all fields.");
    }
  });

  /*
    TODO:   The code below attaches a `click` event to `.remove` buttons
            inside the `<div>` `#cards`.
            The code deletes the specific transaction associated to the
            specific `.remove` button, then removes the its parent `<div>` of
            class `.card`.
    */
  $("#cards").on("click", ".remove", function (e) {
    const card = $(e.target).parents(".card");
    const children = card.children()[1];
    const name = children.getElementsByTagName("p")[0].innerHTML;
    const refno = parseInt(children.getElementsByTagName("p")[1].innerHTML);
    const amount = parseInt(children.getElementsByTagName("p")[2].innerHTML);
    const formData = new URLSearchParams({
      name,
      refno,
      amount,
    }).toString();
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    async function deleteCard() {
      await fetch(`http://localhost:9090/delete?${formData}`, {
        headers: myHeaders,
      }).then((response) => {
        card.remove();
      });
    }

    deleteCard();
  });
});
