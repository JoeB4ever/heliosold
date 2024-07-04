
function showPayNowSpinner() {
	$("#payNowButton").text("Please wait..");
	$("#payNowButton").attr("disabled", true);
}

function hidePayNowSpinner() {
	$("#payNowButton").text("Pay Now");
	$("#payNowButton").attr("disabled", false);
}

window.onloadTurnstileCallback = function () {
	console.log("rendering captcha");
    turnstile.render('#captchaCloudflare', {
        sitekey: '0x4AAAAAAAB4OsQFZWSmsfQD',
		theme: 'light',
        callback: function(token) {
            console.log(`Challenge Success ${token}`);
			try {
				var request = $.ajax({
					type: 'POST',
					url: 'siteverify',
					data: {"cf-turnstile-response" : token}
				});
				request.done(function (msg) {
						setTimeout(hidePayNowSpinner, 1);
					try {
					console.log(msg);
					resp = JSON.parse(msg);
					if(resp.success == true) {
						$("#HostedKey").val(resp.HostedKey);
						$("#Gateway_ID").val(resp.Gateway_ID);
						console.log($("#HostedKey").val());
						console.log($("#Gateway_ID").val());
					}
				} catch (ex) {
				console.log(ex);
				}
				});

				request.fail(function (jqXHR, textStatus) {
					setTimeout(hidePayNowSpinner, 1);
				});
			} catch(ex) {
					setTimeout(hidePayNowSpinner, 1);
				console.log(ex);
			}
        },
    });
};


jQuery(function ($) {

    $(document).ready(function () {

        $(".navbar-nav li a").click(function (event) {
            $(".navbar-collapse").collapse('hide');
        });

        var offset = 80;

		$('.navbar li a').click(function(event) {
			event.preventDefault();
			if($(this).attr('data-page') && $(this).attr('data-page').length > 0) {
				window.location.href = $(this).attr('data-page') + $(this).attr('href');
				return;
			}
		    $($(this).attr('href'))[0].scrollIntoView();
			var navOffset = $('#navbar').height(); 
			scrollBy(0, -navOffset);
			if($(this).attr('href') == '#paynow') {
				$('#payNowModal').modal('show');
			}
		});

        /* center modal */
        function centerModals() {
            $('.modal').each(function (i) {
                var $clone = $(this).clone().css('display', 'block').appendTo('body');
                var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
                top = top > 0 ? top : 0;
                $clone.remove();
                $(this).find('.modal-content').css("margin-top", top);
            });
        }
        $('.modal').on('show.bs.modal', centerModals);
        $(window).on('resize', centerModals);

        function showLoginSpinner() {
            $("#submitContact").text("Please wait..");
            $("#submitContact").attr("disabled", true);
        }

        function hideLoginSpinner() {
            $("#submitContact").text("Submit");
            $("#submitContact").attr("disabled", false);
        }


        function isStringEmpty(str) {
			if(str == null) return true;
			if($.trim(str).length == 0) return true;
			return false;
		}

        $("#contactForm").submit(function (event) {
            try {
                setTimeout(showLoginSpinner, 1);

                event.preventDefault();

				var sendForm = true;
				var errorMsg = "";

                if(sendForm == true && isStringEmpty($("#formName").val())) {
					sendForm = false;
                    errorMsg = "Please fill out name";
				}

                if(sendForm == true && isStringEmpty($("#formEmail").val()) && isStringEmpty($("#formPhone").val())) {
					sendForm = false;
                    errorMsg = "Please fill out email or phone";
				}

                if(sendForm == true && isStringEmpty($("#formMessage").val())) {
					sendForm = false;
                    errorMsg = "Please fill out message";
				}

				if(sendForm == true) {

					var loginForm = $(this);

					var request = $.ajax({
						type: loginForm.attr('method'),
						url: loginForm.attr('action'),
						data: loginForm.serialize()
					});

					request.done(function (msg) {
						console.log(msg);
						$("#formName").val("");
						$("#formEmail").val("");
						$("#formPhone").val("");
						$("#formMessage").val("");
						setTimeout(hideLoginSpinner, 1);
						$("#contactResult").html("Thank you. Your message was sent.");
						$('#ContactPropmpt').modal();
					});

					request.fail(function (jqXHR, textStatus) {
						setTimeout(hideLoginSpinner, 1);
						$("#contactResult").html("There was an error sending your message. Please try again.")
						$('#ContactPropmpt').modal();
					});
				} else {
					setTimeout(hideLoginSpinner, 1);
					$("#contactResult").html(errorMsg);
					$('#ContactPropmpt').modal();
				}
            }
            catch (ex) {
				setTimeout(hideLoginSpinner, 1);
                $("#contactResult").html("There was an error sending your message. Please try again.");
                $('#ContactPropmpt').modal();
            }
        });


	    
	 $("#paynowform").submit(function (event) {
            try {
				var patientData = $("#payNowPatientName").val() + " " + $("#payNowPatientDateOfBirth").val();
				console.log(patientData);
				$("#custrefid").val(patientData);
				console.log($("#custrefid").val());
				$('#payNowModal').modal('hide');
				if ($("#HostedKey").val() === "" || $("#Gateway_ID").val() === "") {
					event.preventDefault();
					alert('Please refresh and try again');
				}
            }
            catch (ex) {
                event.preventDefault();
				setTimeout(hidePayNowSpinner, 1);
				alert('Please refresh and try again');
				console.log(ex);
				return false;
            }
        });
	    
	    	if (window.location.href.indexOf("?payment=success") > -1) {
			$('#thankYouModal').modal();
		}

		if(window.location.hash && window.location.hash.length > 0)
		{
			var navOffset = $('#navbar').height(); 
			scrollBy(0, -navOffset);

			if(window.location.hash == '#paynow') {
				$('#payNowModal').modal('show');
			}
		}
	setTimeout(showPayNowSpinner, 1);

    });
});
