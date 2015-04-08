	// Compatibility shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // PeerJS object
    var peer = new Peer({host:"10.10.111.18", port:9000,path:"/api", debug:3});
    peer.on('open', function(){
      $('#my-id').text(peer.id);
    });
    // Receiving a call
    peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      call.answer(window.localStream);
      step3(call);
    });
    peer.on('error', function(err){
      alert(err.message);
      // Return to step 2 if error occurs
      step2();
    });
    // Click handlers setup
    $(function(){
    	$('#atualiza').click(atualiza());
      $('#ligar').click(function(){
        // Initiate a call!        
        console.log($('#users').val())
        var call = peer.call($('#users').val(), window.localStream);
        step3(call);
      });
      $('#end-call').click(function(){
        window.existingCall.close();
        step2();
      });
      // Retry if getUserMedia fails
      $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
      });
      // Get things started
      step1();
    });
    function step1 () {
      // Get audio/video stream
      navigator.getUserMedia({audio: true, video: false}, function(stream){
        // Set your video displays
        $('#my-audio').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        step2();
      }, function(){ $('#step1-error').show(); });
    }
    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }
    function step3 (call) {
      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }
      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-audio').prop('src', URL.createObjectURL(stream));
      });
      // UI stuff
      window.existingCall = call;
      $('#their-id').text(call.peer);
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    }

    function atualiza() {
    	var usersSelect = $('#users')['0']
		while(usersSelect.length > 0) {
			usersSelect.remove(0);
		}
		var users = $.get('/users', function(data) {
				data.forEach(function(user) {
				var option = document.createElement('option');
				option.text = user;
				option.value = user;
				usersSelect.add(option)
			})
		})

	}