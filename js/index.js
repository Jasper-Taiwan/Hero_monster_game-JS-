//創建初始角色模板
class BaseCharacter {

  // 初始化屬性：name、hp、maxHp、ap、alive
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }


  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }

  getHurt(damage) {
    this.hp = this.hp - damage;
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.alive = false;
  }
  //為什麼這些東西都不用加this?????（因為他是要作為hero和monster要套入的row65代數，因此其實寫什麼都可以，寫a,b也行）
  updateHtml(hpElement, hurtElement){
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - (this.hp/this.maxHp)*100)+"%";
  }
}

//創建英雄
class Hero extends BaseCharacter{//繼承
  constructor(name,hp,ap){//完全繼承模板的屬性
    super(name,hp,ap);

    //加入ＤＯＭ 讓角色可以互動
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    //在遊戲開始時更新生命值的數字
    this.hpElement.textContent = this.hp; //初始時印出
    this.maxHpElement.textContent = this.maxHp; //初始時印出

    //放在constructor最後一行 用來驗證程式能否正常執行
    console.log("召喚英雄: "+this.name+" !");
  }

  attack(character){//只繼承character
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character, Math.floor(damage));//只繼承character(所以帶入的變數照寫),定義更改後的damage後回傳到模板執行
  }

  
  getHurt(damage){
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.maxHpElement);
  }
}

//創建怪物
class Monster extends BaseCharacter{//繼承
  constructor(name,hp,ap){//完全繼承模板的屬性
    super(name,hp,ap);

    //加入ＤＯＭ 讓角色可以互動
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    //在遊戲開始時更新生命值的數字   
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("出現怪獸: "+this.name+" !")
  }

  attack(character){//只繼承character
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character,Math.floor(damage));//只繼承character(所以帶入的變數照寫),定義更改後的damage後回傳到模板執行
  }

   
  getHurt(damage){
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.maxHpElement);
  }
}

//生成兩個角色
var hero = new Hero("Light", 100, 30);
var monster = new Monster("Dark", 100, 10);




