class Level {
    constructor(data) {
        this.map    = new Map(data.plan);
        this.camera = new Camera(context, map);
    }
}