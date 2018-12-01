import * as phaser from 'phaser';
import { UIMenu } from './game/ui';
import { UnitSprite } from './game/world/unit';

// Global Flags.
declare const FLAGS_DIMENSIONS: {
  width: number;
  height: number;
};

// Test Scene
class HelloScene extends phaser.Scene {
  private player!: UnitSprite;
  private cursors!: phaser.Input.Keyboard.CursorKeys;
  private uiMenu!: UIMenu;
  private tilemap!: phaser.Tilemaps.Tilemap;

  constructor() {
    super({ key: 'HelloScene' });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', 'src/assets/spaceship.json');
    this.load.image('spaceship', 'src/assets/spaceship.png');
    this.load.image('pc1', 'src/assets/pc1.png');
    this.load.image('pc2', 'src/assets/pc2.png');
    this.load.image('pc3', 'src/assets/pc3.png');
    this.load.image('npc', 'src/assets/npc.png');
  }

  public create(): void {
    this.tilemap = this.make.tilemap({ key: 'map' });
    const tileset = this.tilemap.addTilesetImage('spaceship');
    this.tilemap.createDynamicLayer(0, tileset, 0, 0);

    this.player = new UnitSprite(this, 100, 100, '1');
    this.children.add(this.player);
    this.player.setScale(0.5);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );
    this.cameras.main.startFollow(this.player, false);
    this.createUI();
  }

  public update(_: number, __: number): void {
    this.uiMenu.update();
    if (this.cursors.left!.isDown) {
      this.player.x -= 5;
      this.player.faceWest();
    }
    if (this.cursors.right!.isDown) {
      this.player.x += 5;
      this.player.faceEast();
    }
    if (this.cursors.down!.isDown) {
      this.player.y += 5;
      this.player.faceSouth();
    }
    if (this.cursors.up!.isDown) {
      this.player.y -= 5;
      this.player.faceNorth();
    }
    this.mouseInput();
  }

  private mouseInput(): void {
    const pointer = this.input.activePointer;
    if (!pointer.isDown) {
      return;
    }
    const worldPoint: Phaser.Math.Vector2 = pointer.positionToCamera(
      this.cameras.main
    ) as Phaser.Math.Vector2;
    const clickedTile = this.tilemap.getTileAtWorldXY(
      worldPoint.x,
      worldPoint.y
    );
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
