/**
 * 6. INITIALISATION & RÈGLES
 */
/**
 * 1. DÉCLARATION DES VARIABLES
 */
// 3. FONCTION POUR CHANGER DE NIVEAU
function passerAuNiveauSuivant () {
    niveauActuel += 1
    info.setScore(0)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    if (niveauActuel == 2) {
        tiles.setCurrentTilemap(tilemap`level 2`)
        game.splash("Niveau 2 !")
    } else if (niveauActuel == 3) {
        tiles.setCurrentTilemap(tilemap`niveau2`)
        game.splash("Niveau 3 !")
    } else if (niveauActuel == 4) {
        tiles.setCurrentTilemap(tilemap`niveau3`)
        game.splash("BOSS FINAL : SURVIS 30 SECONDES !")
        boss = sprites.create(img`
            a a a a a a a a a a a a a a a a 
            a a a a a a a a a a a a a a a a 
            a a a a a a a a a a a a a a a a 
            a a 1 a a a a a a a a a 1 a a a 
            a a 1 1 a a a a a a a 1 1 a a a 
            a a 1 f 1 a a a a a 1 f 1 a a a 
            a a 1 1 1 1 a a a 1 1 1 1 a a a 
            a a a a a a a a a a a a a a a a 
            a a a a a a a a a a a a a a a a 
            a a a a a a a a a a a a a a a a 
            a a 3 3 3 3 3 3 3 3 3 3 3 a a a 
            a a a 3 3 3 3 3 2 2 2 3 a a a a 
            a a a a 3 3 3 2 2 2 2 2 a a a a 
            a a a a a 3 3 2 2 2 2 2 2 a a a 
            a a a a a a a a a 2 2 2 2 2 a a 
            a a a a a a a a a a a a 2 2 2 a 
            `, SpriteKind.Enemy)
        boss.setPosition(240, 240)
        boss.follow(mySprite, 40)
        boss.startEffect(effects.fire)
        // Démarrage du compte à rebours de survie !
        info.startCountdown(30)
    }
    tiles.placeOnRandomTile(mySprite, assets.tile`myTile1`)
    apparaitrePokemonAleatoire()
}
// 2. FONCTION POUR CRÉER UN POKÉMON ALÉATOIRE
function apparaitrePokemonAleatoire () {
    de = Math.randomRange(1, 3)
    if (de == 1) {
        nouveauPokemon = sprites.create(assets.image`Pikachu`, SpriteKind.Food)
    } else if (de == 2) {
        nouveauPokemon = sprites.create(assets.tile`myTile3`, SpriteKind.Food)
    } else {
        nouveauPokemon = sprites.create(assets.tile`myTile5`, SpriteKind.Food)
    }
    tiles.placeOnRandomTile(nouveauPokemon, assets.tile`myTile1`)
}
// 5. VICTOIRE À LA FIN DU COMPTE À REBOURS
info.onCountdownEnd(function () {
    // Le joueur a survécu 30 secondes, il gagne !
    game.over(true)
})
// 7. COLLISIONS
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeLifeBy(-1)
    music.smallCrash.play()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    music.baDing.play()
    info.changeScoreBy(1)
    // Si on est dans les premiers niveaux, manger des Pokémon fait avancer de niveau
    if (niveauActuel < 4) {
        if (info.score() >= 5) {
            passerAuNiveauSuivant()
        } else {
            apparaitrePokemonAleatoire()
        }
    } else {
        // Au niveau du boss, ça donne juste du score et un autre apparaît pour s'occuper !
        apparaitrePokemonAleatoire()
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    scene.cameraShake(4, 500)
    mySprite.x += 20
    pause(1000)
})
let projectile: Sprite = null
let distance = 0
let dy = 0
let dx = 0
let nouveauPokemon: Sprite = null
let de = 0
let boss: Sprite = null
let mySprite: Sprite = null
let niveauActuel = 0
niveauActuel = 1
// Affichage des règles avant de lancer l'action
game.showLongText("Tu es une Pokéball ! Explore la carte, mange les Pokémon pour avancer, et survis au Boss final pendant 30 secondes !", DialogLayout.Center)
info.setLife(5)
scene.setBackgroundColor(13)
tiles.setCurrentTilemap(tilemap`level1`)
mySprite = sprites.create(assets.image`Pokeball`, SpriteKind.Player)
controller.moveSprite(mySprite)
scene.cameraFollowSprite(mySprite)
effects.blizzard.startScreenEffect()
apparaitrePokemonAleatoire()
// 4. TIR DU BOSS (Ralenti pour la survie)
game.onUpdateInterval(3500, function () {
    // Le boss tire toutes les 3,5 secondes au lieu de 2
    if (niveauActuel == 4 && boss) {
        dx = mySprite.x - boss.x
        dy = mySprite.y - boss.y
        distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > 60) {
            projectile = sprites.createProjectileFromSprite(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . 2 2 2 . . . . . . . 
                . . . . . 2 3 1 3 2 . . . . . . 
                . . . . . 3 1 1 1 3 . . . . . . 
                . . . . . 2 3 1 3 2 . . . . . . 
                . . . . . . 2 2 2 . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, boss, 50, 50)
            // La vitesse du projectile est passée de 65 à 45
            projectile.follow(mySprite, 45)
        }
    }
})
