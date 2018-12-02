import * as phaser from 'phaser';
import { World } from './game/world/world';
import { Character } from './game/world/unit';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './game/constants';

// Test Scene
class HelloScene extends phaser.Scene {
  private readonly zombies: Character[] = [];
  private readonly players: Character[] = [];

  private tilemap!: phaser.Tilemaps.Tilemap;
  private world!: World;
  private groundLayer!: phaser.Tilemaps.DynamicTilemapLayer;
  private mouseDown: boolean = false;

  constructor() {
    super({ key: 'HelloScene' });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', 'src/assets/spaceship.json');
    this.load.image('colors', 'src/assets/colors.png');
    this.load.image('spaceship', 'src/assets/spaceship.png');
    this.load.image('pc-1', 'src/assets/pc1.png');
    this.load.image('pc-2', 'src/assets/pc2.png');
    this.load.image('pc-3', 'src/assets/pc3.png');
    this.load.image('npc', 'src/assets/npc.png');

    this.load.image('laser', 'src/assets/laser.png');
  }

  public create(): void {
    this.tilemap = this.make.tilemap({ key: 'map' });

    const tileset = this.tilemap.addTilesetImage('spaceship');
    this.groundLayer = this.tilemap.createDynamicLayer(0, tileset, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );
    this.cameras.main.scrollX = 200;

    this.world = new World(
      this,
      this.tilemap,
      this.groundLayer,
      this.players,
      this.zombies
    );
  }

  public update(_: number, __: number): void {
    this.world.gameLoopUpdate();
    this.mouseInput();
  }

  private mouseInput(): void {
    const pointer = this.input.activePointer;
    if (pointer.isDown && !this.mouseDown) {
      this.mouseDown = pointer.isDown;
      const worldPoint: Phaser.Math.Vector2 = pointer.positionToCamera(
        this.cameras.main
      ) as Phaser.Math.Vector2;
      const clickedTile = this.groundLayer.getTileAtWorldXY(
        worldPoint.x,
        worldPoint.y
      );
      if (clickedTile !== null) {
        this.world.handleClick(clickedTile.x, clickedTile.y);
      }
    }
    this.mouseDown = pointer.isDown;
  }
}

(() => {
  // Constructor has side-effects.
  // tslint:disable-next-line:no-unused-expression
  new phaser.Game({
    type: phaser.AUTO,
    parent: 'content',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resolution: 1,
    backgroundColor: '#EDEEC9',
    scene: [HelloScene],
  });
})();
