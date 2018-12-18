/**
 * Created by Programmer on 08.09.2017.
 */

function Time(){
    PIXI.Container.call(this);
    Time.instance = this;


   
    this.time = time_ad * 1000;

    this.timeWord = new PIXI.Text('Time', {
        fontFamily: "GameFont_bold",
        fontSize: 48,
        fill: 0xffffff/*A7ACB2*/,
        align: 'center',
        lineHeight: '65'

    });

    this.timeWord.anchor.set(0.5);
    this.timeWord.key = 'time_word';    
    this.addChild(this.timeWord);



    this.timeText = new PIXI.Text(this.time / 1000, {
        fontFamily: "GameFont_bold",
        fontSize: 48,
        fill: 0xffffff/*A7ACB2*/,
        align: 'center',
        lineHeight: '65',
        maxWidth: '300'

    });

    this.timeText.anchor.set(0.5);
    this.timeText.key = 'time_text';
    // this.timeText.position.set(860, 480);
    this.addChild(this.timeText);
    this.timeInterval = setInterval(this.updateTime, 1000);
}

Time.constructor = Time;
Time.prototype = Object.create(PIXI.Container.prototype);

Time.prototype.updateTime = function(){
    Time.instance.time -= 1000;
    // console.log('Time.instance.time', Time.instance.time);
    Time.instance.timeText.setText(Time.instance.time / 1000 );
    if (Time.instance.time == 0){
        // MainGame.instance.gameData.gameOver();
        MainGame.instance.field.showWin(false);
        //собрать в массив все таймеры и на этом моменте почистить
        clearInterval(Time.instance.timeInterval);
    }
}

