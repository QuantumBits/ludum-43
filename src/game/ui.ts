import * as phaser from 'phaser';

const menuOutline = 0xffffff;
const menuForeground = 0x031f4c;
const charForeground = 0xddd;
const charHeight = 60;
const charTextSize = 14;
const titleTextPadding = 10;
const titleTextSize = 20;
const hpTextSize = 12;

export class UIMenu extends phaser.GameObjects.Container {
  private static readonly uiWidth = 200;

  private readonly graphics: phaser.GameObjects.Graphics;
  private readonly titleText: phaser.GameObjects.Text;
  private readonly characters: UIMenuCharacter[] = [];

  constructor(scene: phaser.Scene) {
    super(scene, 0, 0);

    // Create Title Text.
    this.titleText = this.scene.add.text(
      titleTextPadding,
      titleTextPadding,
      'Ship Captain'
    );
    this.titleText.setFontSize(titleTextSize);

    // Draw Initial Menu.
    this.graphics = this.scene.add.graphics();
    this.add(this.graphics);
    this.add(this.titleText);

    this.update();

    // Ignore Camera.
    this.setScrollFactor(0, 0);
  }

  public addCharacter(name: string): UIMenuCharacter {
    const item = new UIMenuCharacter(this.scene, this.graphics, name);
    this.add(item);
    this.characters.push(item);
    return item;
  }

  public update(): void {
    this.alignBounds();
    this.graphics.clear();
    this.graphics.lineStyle(1, menuOutline);
    this.graphics.fillStyle(menuForeground);
    this.graphics.strokeRect(0, this.y, this.width, this.height);
    this.graphics.fillRect(0, this.y, this.width, this.height);
    this.characters.forEach((c, i) => {
      // tslint:disable-next-line:no-magic-numbers
      c.update(i * charHeight + 40, this.width - titleTextPadding, charHeight);
    });
  }

  private alignBounds(): void {
    const { width, height } = this.scene.game.canvas;
    this.x = width - UIMenu.uiWidth;
    this.y = 0;
    this.width = UIMenu.uiWidth;
    this.height = height;
  }
}

export class UIMenuCharacter extends phaser.GameObjects.Container {
  constructor(
    scene: phaser.Scene,
    private readonly graphics: phaser.GameObjects.Graphics,
    name: string
  ) {
    super(scene);
    const text = this.scene.add.text(
      titleTextPadding * 2,
      titleTextPadding,
      name
    );
    text.setFontSize(charTextSize);
    this.add(text);

    const hpText = this.scene.add.text(
      titleTextPadding * 2,
      // tslint:disable-next-line:no-magic-numbers
      titleTextPadding * 2.5,
      '10 HP'
    );
    hpText.setFontSize(hpTextSize);
    this.add(hpText);
  }

  public update(y: number, width: number, height: number): void {
    this.x = titleTextPadding;
    this.y = y;
    this.width = width - titleTextPadding;
    this.height = height - titleTextPadding;

    this.graphics.lineStyle(1, charForeground);
    this.graphics.fillStyle(1, charForeground);
    this.graphics.strokeRect(this.x, this.y, this.width, this.height);
    this.graphics.fillRect(this.x, this.y, this.width, this.height);
  }
}
