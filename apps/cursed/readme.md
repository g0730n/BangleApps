# The Cursed Maze
A roguelike game in a psudo 3d raycasted world for the Bangle Js 2.

## How to play
### Touch Screen Controls ###
- Move Forward:  *Screen Top*
- Move Backward:  *Screen Bottom*
- Turn Left:  *Screen Left*
- Turn Right:  *Screen Right*
- Advance Dialoge:  *Anywhere on Screen*
- Show Mini Map: *Swipe UP or DOWN*

Other than movement, and clicking through any dialogue, there is no ther user input required.

In v0.01, Monsters do not chase you. Monster appearance is buggy to say the least. But did I say this game is cursed?

There is an end game, and the game is beatable. I will play through a couple times and balance it if it's too easy.
If you die, the game will automatically close out, and you will have to restart from the beginning.

I borrowed the basic raycasting code concept from here, and made some modifications to make it run better on Bangle JS 2. But I would like to give credit where credit is due as working on this project and Henley's code examples was a real help in learning about raycasting.
https://github.com/AZHenley/raycasting/blob/main/raycast01.js

## Future Updates

### Priority
- [ ] Optimize / Improve refresh rate
- [x] Better monster rendering/collision

### Secondary
- [ ] Add a level
- [ ] More monsters
- [ ] Monsters move positions
- [ ] Add a NPC
