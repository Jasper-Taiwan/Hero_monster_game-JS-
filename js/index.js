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

    //加入特效
    //因為要利用到的setInterval是window的方法，因此如果直接寫this會對應到window，於是我們將指向hero或monster的this存到_this!!!
    var _this = this;
    var i = 1; //用來跑8張動畫

    _this.id =setInterval(function(){ //將setInterval指定到一個id下，這樣才能讓clearInterval要執行時可以呼叫
      //讓傷害的數字可以呈現往上的動畫
      if (i == 1) { //用_this.element去抓到hero-image-block或monster-image-block  下面所有的classname(這個我覺得很特別！！！)
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked"); //傷害文字顯示
        _this.element.getElementsByClassName("hurt-text")[0].textContent =damage;

        _this.element.getElementsByClassName("effect-image")[0].style.display ="block"; //準備讓攻擊特效開始顯示
      }
      
      _this.element.getElementsByClassName("effect-image")[0].src="image/effect/blade/"+i+".png";
      i++;
      
      if (i > 8){
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent ="";//讓數字往下跑的時候，沒有數字呈現（因為有transtion所以回到原位也有動畫）

        _this.element.getElementsByClassName("effect-image")[0].style.display ="none";
        clearInterval(_this.id); //讓setInterval停止的選項(裡面要放他的id),我自己測試是如果放一個變數去存放也行
      }


    }, 50);
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



//設計遊戲戰鬥流程(圖片畫面動作)
function addSkillEvent (){
  var skill = document.getElementById("skill");
  skill.onclick = function(){ //當攻擊圖片被點即時執行下方
    heroAttack();
  }
}

addSkillEvent(); //執行上方程式


//撰寫回合結束的機制
var rounds = 10;

function endTurn(){
  rounds--;
  document.getElementById("round-num").textContent =rounds; //改變回合制上方的文字顯示
  if (rounds < 1){
    //遊戲結束
  }
}


//定義何謂heroattack整個流程（圖片動畫時間）
function heroAttack(){
  document.getElementsByClassName("skill-block")[0].style.display ="none"; //按完攻擊按鈕後，在攻擊過程中攻擊按鈕消失(注意1.class會選到array所以要指定項目 2.＝後要用引號)

  //設定hero攻擊動畫時間
  setTimeout(function(){
    //0.1秒後圖片開始移動
    hero.element.classList.add("attacking");

    //圖片開始移動後0.5秒，去呼叫攻擊指令，並將圖片的attacking屬性刪除，(特別的點在於再刪除後由於transition的關係，他會以0.5秒動畫移動回原點)
    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }
    , 100);


  //設定monster攻擊動畫時間
  setTimeout(function(){
    if (monster.alive){
      monster.element.classList.add("attacking");

      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");

        if (hero.alive == false){ //判斷英雄若死亡
          //遊戲結束
        }
        else {
          document.getElementsByClassName("skill-block")[0].style.display ="block" //攻擊按鈕重新顯示（“注意是用block”）
        }

          endTurn(); //遊戲回合減1
      }, 500);
  
    }

    else {
        //遊戲結束
    }
  },1100);

}


//生成兩個角色
var hero = new Hero("Light", 100, 30);
var monster = new Monster("Dark", 100, 10);




















