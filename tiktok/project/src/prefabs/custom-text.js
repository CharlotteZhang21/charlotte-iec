import * as ContainerUtil from '../utils/container-util';
import * as Tweener from '../utils/tweener';
import * as Util from '../utils/util';

class CustomText extends Phaser.Text {
    constructor(game, args) {

        var text = args.text;
        var fontSize = ContainerUtil.getContainerHeight(args.container);
        var style = {
            font: args.style.fontWeight + " " + fontSize + 'px ' + (args.style.fontFamily + "," + PiecSettings.genericFontFamily)
        };
        
        super(game, 0, 0,args.text, style);

        
        var gradient = this.context.createLinearGradient(0,0,0, this.height);
        
        if(args.style.color !== undefined && args.style.color.length > 0){
            for (var i = 0; i < args.style.color.length; i++) {
                var index = i / args.style.color.length;
                gradient.addColorStop(index, args.style.color[i]); 
            }
        }
        
        this.fill = gradient;
        

        if(args.style.stroke !== undefined)
            this.stroke = args.style.stroke;

        if(args.style.strokeThickness !== undefined)
            this.strokeThickness = args.style.strokeThickness;
        // this.setShadow(2,3,'rgb(0,0,0)', 0);
        if(args.style.shadow!==undefined){
            var shadow = args.style.shadow;
            this.setShadow(shadow.x, shadow.y, shadow.color, shadow.blur, shadow.shadowStroke, shadow.shadowFill);
        }

        this.game.add.existing(this);

        this.currentContainer = args.container;
        this.alpha = 0;

        if (args.autolocalise !== undefined && args.autolocalise == true && PiecSettings.translations[this.text] !== undefined) {
            this.autolocalise();
        } else {
            this.text = " " + this.text + " ";
        }

        if (args.style.fontCase !== undefined && args.style.fontCase == "uppercase") {
            this.text = this.text.toUpperCase();
        }

        //Forcing the text to update again, in case the font didn't load correctly the first time
        this.game.time.events.add(50, function() {
            this.text = this.text.toUpperCase();
        }, this);

        ContainerUtil.bestFit(this, args.container, args.anchor.x, args.anchor.y);
    }

    show() {
        if (this.alpha < 1)
            this.alpha = 1;
    }

    hide() {
        if (this.alpha > 0)
            this.alpha = 0;
    }

    enable() {

    }

    disable() {
        
    }

    autolocalise() {
        var lang = Util.getDeviceLang();
        if (PiecSettings.translations[this.text][lang] !== undefined) {
            this.text = " " + PiecSettings.translations[this.text][lang] + " ";
        }
    }
    
    fitInContainer(container) {
        ContainerUtil.bestFit(this, container, this.anchor.x, this.anchor.y);
    }

}

export default CustomText;