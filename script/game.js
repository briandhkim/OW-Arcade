//remove this_ variable. it is unnecessary!!!!!!!!!!!
function Game(uiUpdater){
    let this_ = this;
    let uiUp = uiUpdater;     //uiUpdater Object
    this.playersInGame = [];        // will always have 2
    this.currentPlayerTurn = 0;     // 0 --player1 ||| 1 --player2 (since playersInPlay is 0 indexed)
    let player1 = null;
    let player2 = null;
    let prevTurnMsgElimination = null;
    let prevTurnMsg = null;
    /***************************
    gameInitiated -> 
    param: none
    return: none
    descpt: creates new players and adds the objects to playersInGame array
            called when Game object is created
    */
    this.gameInitiated = function(){
        player1 = new Player();
        player2 = new Player();
        this_.playersInGame[0] = player1;
        this_.playersInGame[1] = player2;
        console.log(this_.playersInGame);
    }();    /*****!!! called when Game object is created !!!*****/

    /***************************
    addCharacterToPlayer -> 
    param: player --> e.g. game.playersInGame[currentPlayerTurn]
            characterObj --> e.g. ana (object from characterStats.js)
    return: nothing
    descpt: adds a new character to player
    */
    this.addCharacterToPlayer = function(player, characterObj){
        player.addCharacter(characterObj);
    };

    /***************************
    gameStart -> 
    param: none
    return: none
    descpt: calls uiUpdate function for each character images at game start
    */
    this.gameStart = function(){
        uiUp.characterLoadUpdate(player2, 1);
        uiUp.characterLoadUpdate(player1, 0);
    };

    /***************************
    changePlayerTurn -> 
    param: none
    return: none
    descpt: changes player turn; called when character uses skill/item/change char 
    */
    this.changePlayerTurn = function(){
        if(this.currentPlayerTurn===0){
            this.currentPlayerTurn++;
            uiUp.turnChangeLoadUpdate(this.playersInGame[this.currentPlayerTurn], this.currentPlayerTurn);
            uiUp.clearConsoleMessage();
            uiUp.updatePrevTurnMsg(prevTurnMsg);
            if(prevTurnMsgElimination){
                uiUp.updatePrevTurnMsg(prevTurnMsgElimination);
            }
            uiUp.updateConsoleMessageTurnChange(this.currentPlayerTurn);
            prevTurnMsg = null;
            prevTurnMsgElimination = null;
            return;
        }else if(this.currentPlayerTurn===1){
            this.currentPlayerTurn--;
            uiUp.turnChangeLoadUpdate(this.playersInGame[this.currentPlayerTurn], this.currentPlayerTurn);
            uiUp.clearConsoleMessage();
            uiUp.updatePrevTurnMsg(prevTurnMsg);
            if(prevTurnMsgElimination){
                uiUp.updatePrevTurnMsg(prevTurnMsgElimination);
            }
            uiUp.updateConsoleMessageTurnChange(this.currentPlayerTurn);
            prevTurnMsg = null;
            prevTurnMsgElimination = null;
            return;
        }else{
            console.log('changePlayerTurn error in game object');
        }
    };


    /***************************
    turnChangeChar -> 
    param: player --> e.g. game.playersInGame[currentPlayerTurn]
            characterNum --> value grabbed from available character 
                    list in html li element when clicked
    return: nothing
    descpt: changes player character. calls changeCharacterFunction in player object
    */
    this.turnChangeChar = function(characterNum){
        const charChangeCheck = this_.playersInGame[this_.currentPlayerTurn].changeCharacter(characterNum);
        const currentPlayer = this.playersInGame[this.currentPlayerTurn];
        if(charChangeCheck){
            if(this.currentPlayerTurn){
                prevTurnMsg = `Player 2 switched to ${currentPlayer.activeCharacter.name}`; 
            }else{
                prevTurnMsg = `Player 1 switched to ${currentPlayer.activeCharacter.name}`;
            }
            uiUp.changeCharacterUpdate(currentPlayer, this.currentPlayerTurn);
            this.changePlayerTurn();
        }else if(!charChangeCheck){
            const consoleMsg = "You can't select this character...";
            uiUp.updateConsoleCustomMsg(consoleMsg);
        }else{
            console.log('error in turnChangeChar in game obj');
        }
    };
    
    /***************************
    turnSkillChar -> 
    param: (int) 0-3, skill array iterator based on player selection
    return: none
    descpt: called when player selects a skill to use. 
    */
    this.turnSkillChar = function(skillNum){
        let selectedSkill = this_.playersInGame[this_.currentPlayerTurn].activeCharacter.skillArr[skillNum];
        if(selectedSkill.pp<=0){
            uiUp.updateConsoleCustomMsg("No more pp for this skill...");
            return;
        }
        let skillName = this.playersInGame[this.currentPlayerTurn].activeCharacter.skillArr[skillNum].name;
        let charName = this.playersInGame[this.currentPlayerTurn].activeCharacter.name;
        let skillOutput = this.playersInGame[this.currentPlayerTurn].skillSelected(skillNum);
        //skillOutput =array [0]:heal/damage val  [1]:heal true||false
        prevTurnMsg = charName +" used " + skillName +"!";
        if(!skillOutput[1]){
            if(this.currentPlayerTurn===0){
                this.playersInGame[1].activeCharacter.takeDamage(skillOutput[0][0]);
                uiUp.currentCharDamageTakeHP(this.playersInGame[1].activeCharacter, 1);
                if(this.checkCharDead(this.playersInGame[1].activeCharacter)){  //checking hcaracter elimination status
                    prevTurnMsgElimination = this.playersInGame[1].activeCharacter.name +" was eliminated!";  
                    this.deadCharSwap(this.playersInGame[1], 1);       //swaping out eliminated char   
                    return;
                }
                this.changePlayerTurn();
            }else if(this.currentPlayerTurn===1){
                this.playersInGame[0].activeCharacter.takeDamage(skillOutput[0][0]);
                uiUp.currentCharDamageTakeHP(this.playersInGame[0].activeCharacter, 0);
                if(this.checkCharDead(this.playersInGame[0].activeCharacter)){
                    prevTurnMsgElimination = this.playersInGame[0].activeCharacter.name +" was eliminated!";
                    this.deadCharSwap(this.playersInGame[0], 0);   
                    return;
                }
                this.changePlayerTurn();
            }
        }else if(skillOutput[1]){
            this.playersInGame[this.currentPlayerTurn].activeCharacter.addHP(skillOutput[0]);
            uiUp.currentCharDamageTakeHP(this.playersInGame[this.currentPlayerTurn].activeCharacter, this.currentPlayerTurn);
            this.changePlayerTurn();
        }
    };
    /***************************
    checkCharDead -> 
    param: character object
    return: bool
    descpt: returns false if character is alive; true if dead
    */
    this.checkCharDead = function(character){
        if(character.alive){
            return false;
        }else if(!character.alive){
            return true;
        }else{
            console.log('error checkCharDead function');
        }
    };
    /***************************
    deadCharSwap -> 
    param: player object, player turn (int)
    return: none
    descpt: calls gameOver function if player's characters are 
        eliminated. otherwise select the next available character
        and swaps active character
    */
    this.deadCharSwap = function(player, playerTurnNum){
        player.charactersAlive--;
        if(player.charactersAlive===0){
            console.log('game over');
            gameOver(playerTurnNum);
        }else if(player.charactersAlive>0){
            for (var char in player.characterArr){
                if(player.characterArr[char].alive){
                    player.eliminatedCharSwap(char);
                    uiUp.changeCharacterUpdate(player, playerTurnNum);
                    this.changePlayerTurn();
                    return;
                }
            }
        }else{
            console.log("error at deadCharSwap in gameObj");
        }
         
    };

    /***************************
    turnUseHealthPack -> 
    param: none
    return: none
    descpt: called when player uses health pack for the turn; changes 
        turn after using the healthpack; displays message in console
        if none are available
    */
    this.turnUseHealthPack = function(){
        const currentPlayer = this.playersInGame[this.currentPlayerTurn];
        if(currentPlayer.healthPackCount!==0){
            currentPlayer.activeCharacter.addHP(currentPlayer.healthPack);
            uiUp.currentCharDamageTakeHP(currentPlayer.activeCharacter, this.currentPlayerTurn);
            currentPlayer.healthPackCount--;
            prevTurnMsg = currentPlayer.activeCharacter.name + " used Health Pack!";
            this.changePlayerTurn();
        }else{
            uiUp.updateConsoleCustomMsg("No more health packs...");
        }
    };

    /***************************
    turnReload -> 
    param: none
    return: none
    descpt: calls relaod function for active character; calls player
        turn change function after
    */
    this.turnReload = function(){
        const currentPlayerChar = this.playersInGame[this.currentPlayerTurn].activeCharacter;
        prevTurnMsg = currentPlayerChar.name + " reloaded!";
        currentPlayerChar.reload();
        this.changePlayerTurn();
    };
}