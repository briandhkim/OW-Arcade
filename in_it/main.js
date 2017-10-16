/***************************
	 -> 
	param: 
	return: 
	descpt: 
 	*/

let uiUpdate = null;
let game = null;
$(document).ready(function(){
	$('.charSelectDrop').click(charDropMenuOpen);
	$('.charDropMenu').on('click',function(evt){
		evt.stopPropagation();
		charDropMenuClose();
	});
	mouseHandlerGameArea();


	uiUpdate = new UIupdater();
	game = new Game(uiUpdate);
	// game.gameInitiated();
	playerCreateTest();
	game.gameStart();
	// uiHandleTest();
});

function playerCreateTest(){
	game.addCharacterToPlayer(game.playersInGame[0], mei);
	game.addCharacterToPlayer(game.playersInGame[1], torbjorn);
	game.addCharacterToPlayer(game.playersInGame[0], reinhardt);
	game.addCharacterToPlayer(game.playersInGame[1], mccree);
	game.addCharacterToPlayer(game.playersInGame[0], dva);
	game.addCharacterToPlayer(game.playersInGame[1], genji);
}

function playerAttackTest(player){
	player.skillSelected(1);
	uiUpdate.updateConsoleMessage(player.activeCharacter.name, player.activeCharacter.skillArr[1].name);

}



function mouseHandlerGameArea(){
	$('.moveOptionSkills').click(skillMenuClickMouse);
	$('.moveOptionChangeChar').click(charOptClickMouse);
	$('.moveOptionUse').click(useOptClickMouse);
	$('.backButton').click(backButtonClickMouse);

	$('.changeCharList li').click(changeCharListClickMouse);
}

/** initial screen ui handler **/
function charDropMenuOpen(){
	if($('.charDropMenu').css('display')=='none'){
		$('.charDropMenu').show();
	}
}
function charDropMenuClose(){
	if($('.charDropMenu').css('display')=='block'){
		$('.charDropMenu').hide();
	}
}
/**** end of initial screen ui handler ****/

/******************* ui handlers for game area *****************/ 
let spanAdd = $("<span>").addClass("tracker").html('&#9830');
let menuOpened = false;

/******** ui handlers for keyboard input *******/
$(window).keydown(function(event){
	var key = event.keyCode;
	var this_ = $('.tracker').parent().closest('.moveOpt');		//track span in choosing move options
	var this_li_ = $('.tracker').parent().closest('li');		//track span in the move option list
	//	37left	38up	39right	40down	87w	65a	83s	68d
	if(key===39||key===68){			//right key
		if(this_.next('.moveOpt').length >0){
			event.preventDefault();		//prevents arrow key scroll
			this_.next('.moveOpt').append(spanAdd);
			this_.children('.tracker').remove();
		}
	}else if(key===40||key===83){		//down key
		if(menuOpened){	
			if(this_li_.next('li').length>0){
				event.preventDefault();
				this_li_.next('li').append(spanAdd);
				this_li_.children('.tracker').remove();
			}
		}
		if(this_.next('.moveOpt').next('.moveOpt').length > 0){
			event.preventDefault();
			this_.next('.moveOpt').next('.moveOpt').append(spanAdd);
			this_.children('.tracker').remove();
		}
	}else if(key===37||key===65){		//left key
		if(this_.prev('.moveOpt').length>0){
			event.preventDefault();
			this_.prev('.moveOpt').append(spanAdd);
			this_.children('.tracker').remove();
		}
	}else if(key===38||key===87){		//up key
		if(menuOpened){
			if(this_li_.prev('li').length>0){
				event.preventDefault();
				this_li_.prev('li').append(spanAdd);
				this_li_.children('.tracker').remove();
			}
		}
		if(this_.prev('.moveOpt').prev('.moveOpt').length>0){
			event.preventDefault();
			this_.prev('.moveOpt').prev('.moveOpt').append(spanAdd);
			this_.children('.tracker').remove();
		}
	}else if(key===32){		//space key
		if(menuOpened){
			if(this_li_.hasClass('backButton')){
				backButtonClick(this_li_.parent().closest('div'));
			}else if(this_li_.closest('div').hasClass('changeCharList')){
				// this_li_.val()
				changeCharListClick(this_li_.val());
			}
		}
		if(this_.hasClass('moveOptionSkills')){
			skillMenuClick();
			this_.children('span:first').remove();
		}else if(this_.hasClass('moveOptionChangeChar')){
			charOptClick();
			this_.children('span:first').remove();
		}else if(this_.hasClass('moveOptionUse')){
			useOptClick();
			this_.children('span:first').remove();
		}
	}
});

/****click handler for changing character option  in game ****/
function changeCharListClick(charVal){
	let changeCharNum = charVal;
	let currentPlayer = game.playersInGame[game.currentPlayerTurn];
	currentPlayer.changeCharacter(changeCharNum);
	backButtonClickMouse()
}
/***************************
changeCharListClick -> 
param: none
return: none
descpt: handles player turn change when selected by user
 */
function changeCharListClickMouse(){
	let changeCharNum = $(this).val();
	// console.log(changeCharNum);
	let currentPlayer = game.playersInGame[game.currentPlayerTurn];
	currentPlayer.changeCharacter(changeCharNum);
	backButtonClickMouse()
}
/****end of click handler for changing character option in game ****/

function skillMenuClick(){
	$('.skillList').css('display','block');
	$('.skillList li:first-child').append(spanAdd);
	menuOpened = true;
}

function charOptClick(){
	$('.changeCharList').css('display','block');
	$('.changeCharList li:first-child').append(spanAdd);
	menuOpened = true;
}
function useOptClick(){
	$('.useList').css('display','block');
	$('.useList li:first-child').append(spanAdd);
	menuOpened = true;
}
function backButtonClick(elmt){
	// $(this_li_).parent().closest('div').css('display','none');
	$(elmt).css('display','none');
	$('.moveOptionSkills').append(spanAdd);
	menuOpened = false;
}
/*******ui handlers with keyboard end*******/
/****mouse click handler for main game area ****/
function skillMenuClickMouse(){
	$('.tracker').remove();
	$('.skillList').css('display','block');
	$('.skillList li:first-child').append(spanAdd);
	menuOpened = true;
}
function charOptClickMouse(){
	$('.tracker').remove();
	$('.changeCharList').css('display','block');
	$('.changeCharList li:first-child').append(spanAdd);
	menuOpened = true;
}
function useOptClickMouse(){
	$('.tracker').remove();
	$('.useList').css('display','block');
	$('.useList li:first-child').append(spanAdd);
	menuOpened = true;
}
function backButtonClickMouse(){
	$('.tracker').closest('div').css('display', 'none');
	$('.moveOptionSkills').append(spanAdd);
	menuOpened = false;
}
/****end of mouse click handler for main game area ****/
/********** end of ui handlers for game area *********/