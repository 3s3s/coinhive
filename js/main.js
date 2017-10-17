'use strict';

const SITE_KEY = 'uL9bpLiA9CN0ohXna3YTPY4wiCB89JDu';

var miner = new CoinHive.User(SITE_KEY, 'test-user');

const modals = {
    OKCancel : function(title, body, callback)
    {
        modals.show(title, body, 'Confirm', 'Cancel', callback);
    },
    show : function(title, body, ok, cancel, callback)
    {
        $('#myModalLabel').html(''); $('#myModalLabel').append($(title));
        $('.modal-body').html(''); $('.modal-body').append($(body));
        
        $('#id_modal_cancel').html(cancel);
        $('#id_modal_ok').html(ok);
        
        $('#id_modal_cancel').click(function(){callback('cancel');})
        $('#id_modal_ok').click(function(){$('#myModal').modal('hide'); callback('ok');})
        
        $('#myModal').modal('show');
    }
}


function ShowMiningInfo()
{
	const intervalID = setInterval(function() {
		var hashesPerSecond = miner.getHashesPerSecond();
		var totalHashes = miner.getTotalHashes();
		var acceptedHashes = miner.getAcceptedHashes();

		// Output to HTML elements...
		if (hashesPerSecond < 10)
		    clearInterval(intervalID);
		    
		$('#hashesPerSecond').html(Math.round(hashesPerSecond) + ' H/s');
		$('#totalHashes').html('Total hashes: ' + Math.round(totalHashes));
		$('#acceptedHashes').html('Accepted hashes: ' + Math.round(acceptedHashes));
		
	}, 10000);
}

$(function()
{
    window.addEventListener("message", receiveMessage, false);
    
    CancelMining();
    
    modals.OKCancel('<span>Подтвердите, что хотите майнить</span>', '<span>Сейчас начнется майнинг, если вы не против, то жмите "Confirm"</span>', (ret) =>{
        if (ret == 'ok')
            AllowMining();
        else
            CancelMining();
    });
    
    ShowMiningInfo();
    
	//CancelMining();
	//AllowMining();
	//window.postMessage('start', '*');

	// Update stats once per second
	const intervalID = setInterval(function() {
		var hashesPerSecond = miner.getHashesPerSecond();

		// Output to HTML elements...
		if (hashesPerSecond < 10)
		{
		    clearInterval(intervalID);
		    CancelMining();
		}
	}, 10000);
});

function receiveMessage(event)
{
    if (event.data !== "start")
        return;

    miner.start();
}
function AllowMining()
{
	$.getJSON( "/auth?key="+encodeURIComponent(SITE_KEY), function( ret ) {
	    if (ret && ret.data)
	    {
    		window.postMessage({type: 'coinhive-auth-success', params: {
    			token: JSON.parse(ret.data).token
    		}}, "*");
    		
            window.postMessage('start', '*');
	    }
	})
      .fail(function() {
        console.log( "error" );
      });
    
}

function CancelMining()
{
    miner.stop();
    window.postMessage({type: 'coinhive-auth-canceled'}, "*");
    window.postMessage({type: 'coinhive-auth-success', params: {token: ""}}, "*");
}


