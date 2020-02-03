Default_Game_Interpreter = Game_Interpreter;
Default_DataManager = DataManager
class Additional_Events_Game_Interpreter extends Default_Game_Interpreter {
    pluginCommand(command,args) {
        $ev.on('CreatePluginCommands', (command, args)=>super.pluginCommand(command, args));
        if ($ev)
        {
            $ev.emit('CreatePluginCommands', this, command, args)
        }
    }
}
class Additional_Events_DataManager extends Default_DataManager {
    static createGameObjects() {
        $ev.on('CreateGameObjects', super.createGameObjects);
        if ($ev) {
            $ev.emit('CreateGameObjects', this)
        }
    }
}
Game_Interpreter = Additional_Events_Game_Interpreter;
DataManager = Additional_Events_DataManager;