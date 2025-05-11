class Weapon {
    getDescription() { return 'Невідома зброя'; }
    getDamage() { return 0; }
    getRange() { return 0; }
    getWeight() { return 0; }
    getCost() { return 0; }
    getYear() { return 2020; }
}

class Rifle extends Weapon {
  constructor(year) { 
    super(); 
    this.year = year; 
  }
  getDescription() { return `Автоматична гвинтівка (${this.year})`; }
  getDamage() { return 80; }
  getRange() { return 600; }
  getWeight() { return 5.5; }
  getCost() { return 3000; }
  getYear() { return this.year; }
}

class Pistol extends Weapon {
  constructor(year) { 
    super(); 
    this.year = year; 
  }
  getDescription() { return `Пістолет (${this.year})`; }
  getDamage() { return 40; }
  getRange() { return 150; }
  getWeight() { return 2; }
  getCost() { return 1000; }
  getYear() { return this.year; }
}

class AutomaticGun extends Weapon {
  constructor(year) { 
    super(); 
    this.year = year; 
  }
  getDescription() { return `Автомат (${this.year})`; }
  getDamage() { return 70; }
  getRange() { return 400; }
  getWeight() { return 4; }
  getCost() { return 2000; }
  getYear() { return this.year; }
}

//DECORATOR
class WeaponDecorator extends Weapon {
  constructor(baseWeapon) {
    super();
    this.baseWeapon = baseWeapon;
  }
  getDescription() { return this.baseWeapon.getDescription(); }
  getDamage() { return this.baseWeapon.getDamage(); }
  getRange() { return this.baseWeapon.getRange(); }
  getWeight() { return this.baseWeapon.getWeight(); }
  getCost() { return this.baseWeapon.getCost(); }
  getYear() { return this.baseWeapon.getYear(); }
}

class Scope extends WeaponDecorator {
  getDescription() { return this.baseWeapon.getDescription() + ' + Приціл'; }
  getRange() { return this.baseWeapon.getRange() + 100; }
  getWeight() { return this.baseWeapon.getWeight() + 0.5; }
  getCost() { return this.baseWeapon.getCost() + 500; }
}

class NightVision extends WeaponDecorator {
  getDescription() { return this.baseWeapon.getDescription() + ' + Нічне бачення'; }
  getWeight() { return this.baseWeapon.getWeight() + 1; }
  getCost() { return this.baseWeapon.getCost() + 1200; }
}

class Silencer extends WeaponDecorator {
  getDescription() { return this.baseWeapon.getDescription() + ' + Глушник'; }
  getWeight() { return this.baseWeapon.getWeight() + 0.7; }
  getCost() { return this.baseWeapon.getCost() + 800; }
}


class ArsenalManager {
    constructor() { 
        this.weapons = []; 
    }

    addWeapon(weapon) {
      if (weapon.getWeight() <= 6) {
        this.weapons.push(weapon);
        return 'Зброя додана до арсеналу.';
      } else {
        return 'Вага перевищує допустиму норму (6 кг)!';
      }
    }

    listWeapons() {
      return this.weapons.map(w =>
        `${w.getDescription()}\nВартість: ${w.getCost()} | Вага: ${w.getWeight()}`
      ).join('\n\n');
    }

    getMostExpensiveWeapon() {
      return this.weapons.reduce((max, w) =>
        w.getCost() > max.getCost() ? w : max, this.weapons[0]);
    }

    revaluateWeapons(currentYear) {
      return this.weapons.map(w => {
        const age = currentYear - w.getYear();
        const wear = 1 - Math.min(age * 0.05, 0.5);
        const newCost = (w.getCost() * wear).toFixed(2);
        return `${w.getDescription()} Нова вартість: ${newCost}`;
      }).join('\n');
    }
}

//FACADE
class ArsenalFacade {
    constructor() {
      this.arsenal = new ArsenalManager();
    }

    createWeapon(type, year, accessories = []) {
      let weapon;
      if (type === 'rifle') weapon = new Rifle(year);
      else if (type === 'pistol') weapon = new Pistol(year);
      else if (type === 'autoGun') weapon = new AutomaticGun(year);
      else return 'Невідомий тип зброї!';

      accessories.forEach(acc => {
        if (acc === 'scope') weapon = new Scope(weapon);
        if (acc === 'nightvision') weapon = new NightVision(weapon);
        if (acc === 'silencer') weapon = new Silencer(weapon);
      });

      return this.arsenal.addWeapon(weapon);
    }

    showWeapons() {
      return this.arsenal.listWeapons() || 'Арсенал порожній.';
    }

    showMostExpensive() {
      const w = this.arsenal.getMostExpensiveWeapon();
      return `Найдорожчий комплект:\n${w.getDescription()}\nВартість: ${w.getCost()}`;
    }

    revaluateWeapons(currentYear) {
      return this.arsenal.revaluateWeapons(currentYear);
    }
}


const arsenalFacade = new ArsenalFacade();

function addWeapon() {
    const type = document.getElementById('weaponType').value;
    const year = parseInt(document.getElementById('weaponYear').value);
    const accessories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    const result = arsenalFacade.createWeapon(type, year, accessories);
    log(result);
}

function showWeapons() {
    const result = arsenalFacade.showWeapons();
    log(result);
}

function showMostExpensive() {
    const result = arsenalFacade.showMostExpensive();
    log(result);
}

function revaluate() {
    const result = arsenalFacade.revaluateWeapons(2025);
    log(result);
}

function log(text) {
    document.getElementById('log').innerText = text;
}