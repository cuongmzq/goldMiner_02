/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

let res = {
    rope_tile: "res/Miner_and_His_Items/rope_tile.png",
    rope_hide: "res/Miner_and_His_Items/rope_hide.png",
    roll: "res/Miner_and_His_Items/roll.png",
    hook: "res/Miner_and_His_Items/hook.png",

    bg_tile_01: "res/Background/bg_tile_01.png",
    bg_tile_02: "res/Background/bg_tile_02.png",
    bg_tile_03: "res/Background/bg_tile_03.png",
    bg_tile_04: "res/Background/bg_tile_04.png",
    ground_tile: "res/Background/ground_tile.png",
    purple_tile: "res/Background/purple_tile.png",
    game_top_bg: "res/Background/game_top_bg.png",

    white_tile: "res/Background/white_tile.png",

    gold_00: "res/Collectable_Items/gold_00.png",
    gold_01: "res/Collectable_Items/gold_01.png",
    gold_02: "res/Collectable_Items/gold_02.png",
    gold_03: "res/Collectable_Items/gold_03.png",

    diamond: "res/Collectable_Items/diamond.png",

    rock_00: "res/Collectable_Items/rock_00.png",
    rock_01: "res/Collectable_Items/rock_01.png",

    picked_gold_03: "res/Picked_Item/picked_gold_03.png",
    picked_diamond: "res/Picked_item/picked_diamond.png",
    picked_rock: "res/Picked_item/picked_rock.png",



};

let g_resources = [];
for (let i in res) {
    g_resources.push(res[i]);
}
