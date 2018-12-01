import * as phaser from 'phaser';
import { UIMenu } from './game/ui';

// Global Flags.
declare const FLAGS_DIMENSIONS: {
  width: number;
  height: number;
};

// Test Scene
class HelloScene extends phaser.Scene {
  private player!: phaser.GameObjects.Sprite;
  private cursors!: phaser.Input.Keyboard.CursorKeys;
  private uiMenu!: UIMenu;
  private tilemap!: phaser.Tilemaps.Tilemap;

  constructor() {
    super({ key: 'HelloScene' });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', 'src/assets/desert.json');
    this.load.image('desert', 'src/assets/desert.png');
    this.load.image('player', 'src/assets/mushroom.png');
  }

  public create(): void {
    this.tilemap = this.make.tilemap({ key: 'map' });
    const tileset = this.tilemap.addTilesetImage('desert');
    this.tilemap.createDynamicLayer(0, tileset, 0, 0);

    this.player = this.add.sprite(100, 100, 'player');
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.startFollow(this.player, false);
    this.createUI();
  }

  public update(_: number, __: number): void {
    this.uiMenu.update();
    this.player.angle += 1;
    if (this.cursors.left!.isDown) {
      this.player.x -= 5;
    }
    if (this.cursors.right!.isDown) {
      this.player.x += 5;
    }
    if (this.cursors.down!.isDown) {
      this.player.y += 5;
    }
    if (this.cursors.up!.isDown) {
      this.player.y -= 5;
    }
    this.mouseInput();
  }

  private mouseInput(): void {
    const pointer = this.input.activePointer;
    if (!pointer.isDown) {
      return;
    }
    const worldPoint: Phaser.Math.Vector2 = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const clickedTile = this.tilemap.getTileAtWorldXY(worldPoint.x, worldPoint.y);
    if (clickedTile !== null) {
      clickedTile.setAlpha(0);
    }
  }

  private createUI(): void {
    this.uiMenu = new UIMenu(this);
    this.uiMenu.addCharacter('Jesse');
    this.uiMenu.addCharacter('Alex');
    this.uiMenu.addCharacter('Matan');
    this.children.add(this.uiMenu);
  }
}

(() => {
  // Constructor has side-effects.
  // tslint:disable-next-line:no-unused-expression
  new phaser.Game({
    type: phaser.AUTO,
    parent: 'content',
    width: FLAGS_DIMENSIONS.width,
    height: FLAGS_DIMENSIONS.height,
    resolution: 1,
    backgroundColor: '#EDEEC9',
    scene: [HelloScene],
  });
})();
