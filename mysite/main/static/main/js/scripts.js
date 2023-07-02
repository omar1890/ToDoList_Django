function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
$(function (prompt) {
    
    var INDEX = 0;
    
    $("#chat-submit").click(function (e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() == '') {
            return false;
        }
        var csrftoken = getCookie("csrftoken");
        generate_message(msg, 'self');
        // Send AJAX request
        $.ajax({
            url: receiveMessageURL,  // Replace with the actual URL of your backend function
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            }, // Use the appropriate HTTP method (POST, GET, etc.)
            data: {
                message: msg  // Pass the message value as a parameter to the backend
            },
            success: function (response) {
                // Handle the response from the backend if needed
                if (response.trim() == '') {
                    return false;
                }
                var prompt = parseInt(response.split("_")[0]);
                setTimeout(function () {
                    generate_message(response, 'user',prompt);
                }, 1000)
                console.log(response);
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
        var buttons = [
            {
                name: 'Existing User',
                value: 'existing'
            },
            {
                name: 'New User',
                value: 'new'
            }
        ];

    })

    function generate_message(msg, type,prompt_id=0) {
        INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
        str += "          <span class=\"msg-avatar\">";
        if (type != 'self') {
            str += "            <img src=\"https:\/\/www.internetandtechnologylaw.com\/files\/2019\/06\/iStock-872962368-chat-bots.jpg\">";
        } else {
            str += "            <img src=\"https:\/\/www.gravatar.com\/avatar\/commons\/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250\">";
        }
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        if (type != 'self') {
            str += "<br><br><button data-toggle=\"modal\" data-prompt-id=\"" + prompt_id + "\" data-target=\"#exampleModal\" class=\"btn\" id=\"like\"><i class=\"fa fa-thumbs-up fa-lg\" aria-hidden=\"true\"></i></button><button class=\"btn\" data-prompt-id=\"" + prompt_id + "\" id=\"unlike\"><i class=\"fa fa-thumbs-down fa-lg\" aria-hidden=\"true\"></i></button>"
        }
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        if (type == 'self') {
            $("#chat-input").val('');
        }
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    }

    function generate_button_message(msg, buttons) {
        /* Buttons should be object array 
          [
            {
              name: 'Existing User',
              value: 'existing'
            },
            {
              name: 'New User',
              value: 'new'
            }
          ]
        */
        INDEX++;
        var btn_obj = buttons.map(function (button) {
            return "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\"" + button.value + "\">" + button.name + "<\/a><\/li>";
        }).join('');
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg user\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "          <div class=\"cm-msg-button\">";
        str += "            <ul>";
        str += btn_obj;
        str += "            <\/ul>";
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
        $("#chat-input").attr("disabled", true);
    }

    $(document).delegate(".chat-btn", "click", function () {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
    })

    $("#chat-circle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })



})

$(".chat-logs").on("click", "#like", function () {
    var promptId = $(this).data("prompt-id");
    showModal('like',promptId);
});

$(".chat-logs").on("click", "#unlike", function () {
    var promptId = $(this).data("prompt-id");
    showModal('unlike',promptId);
});

// Function to show the modal
function showModal(previousButtonType,promptId) {
    // Show the modal
    $("#myModal").modal("show");
   
    // Submit button click event
    $("#modal-submit").on("click", function () {
        // Get the input value
        inputValue = $("#modal-input").val();
        like=false;
        dislike=false;
        // Perform the desiunlike action based on the input value and previousButtonType
        if (previousButtonType === "like") {
            like = true;
            // Perform the action for the like button with the input value
        } else if (previousButtonType === "unlike") {
            // Perform the action for the unlike button with the input value
            dislike=true;
        }
        var csrftoken = getCookie("csrftoken");

        $.ajax({
            url: sendFeedbackURL,  // Replace with the actual URL of your backend function
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            }, // Use the appropriate HTTP method (POST, GET, etc.)
            data: {
                prompt: promptId,
                comment: inputValue,
                like: like,
                dislike:dislike,
            },
            success: function (response) {
                console.log(response);
            },
            error: function (xhr, status, error) {
                // Handle any error that occurs during the AJAX request
                console.log(error);
            }
        });
        // Clear the input value
        $("#modal-input").val("");

        // Hide the modal
        $("#myModal").modal("hide");
       
    });
}