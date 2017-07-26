/* global */
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';
import 'babel-polyfill'

//import _ from 'lodash'
import React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
//import PropTypes from 'prop-types'

require('pixi.js')

// index.html ファイルをコピーする
require('file-loader?name=../../dist/[name].[ext]!../index.html');

require('file-loader?name=../../dist/img/[name].[ext]!../img/sprite.png');

const logger = createLogger()

//-----------------------------------
// Action creators (Actionを返す)
//-----------------------------------

// 現段階では Action creators は使わないのでコメントアウトしておく
//const anAction = () => {
//  return {
//    type: '',
//  }
//}

//-----------------------------------
// Reducer
//-----------------------------------

const aState = (state = null/*, action*/) => {
  return state
}

//-----------------------------------
// Component
//-----------------------------------

class AppComponent extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

AppComponent.propTypes = {};

//-----------------------------------
// Container
//-----------------------------------

const AppContainer = (() => {

  const mapStateToProps = (/*state, ownProps*/) => {
    return {};
  }
  
  const mapDispatchToProps = (/*dispatch*/) => {
    return {}
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppComponent);

})();

//-----------------------------------
// Store
//-----------------------------------

const store = (process.env.NODE_ENV === 'development')
  ? createStore(aState, applyMiddleware(logger))
  : createStore(aState);

//-----------------------------------
// 画面に表示する
//-----------------------------------

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('stage')
);


//===================================
// ゲーム
//===================================

(() => {

  let stage = new PIXI.Container();

  let renderer = PIXI.autoDetectRenderer(640, 360, {
    antialias:        true,
    backgroundColor : 0x00ffd4,
  });

  document.getElementById('stage').appendChild(renderer.view);

  let animation = function () {
    requestAnimationFrame(animation);
    renderer.render(stage);
  };
  animation();

  var loader = new PIXI.loaders.Loader();

  loader
    .add('sprite', './img/sprite.json')
    .once('complete', function(){

    let
      // テクスチャの配列（Left: 0, Back: 1, Right: 2, Front: 3）
      ttCharacter = [],

      elmAnimationCharacter = [],
      elmCharacter = new PIXI.Container(),
      i, j, k;

      for (i = 0; i < 4; i++) {
        ttCharacter[i] = [];

        for (j = 0; j < 4; j++) {
          // 4フレーム
          var frame = j === 0 ? 0:
                      j === 1 ? 1:
                      j === 2 ? 0:
                      j === 3 ? 2:
                      0;
          ttCharacter[i].push(PIXI.Texture.fromFrame('character-' + i + '-' + frame));
        }
      }

      for (k = 0; k < 4; k++) {
        elmAnimationCharacter.push(new PIXI.extras.AnimatedSprite(ttCharacter[k]));
        elmAnimationCharacter[k].play();
        elmAnimationCharacter[k].animationSpeed = 0.1;
        elmAnimationCharacter[k].anchor.set(0.5);
        elmAnimationCharacter[k].visible = false;
        elmCharacter.addChild(elmAnimationCharacter[k]);
      }

      elmAnimationCharacter[3].visible = true;

      elmCharacter.position.set(640 / 3, 360 / 2);

      stage.addChild(elmCharacter);

      let keyStatus = [];
      for (i = 0; i < 4; i++) {
        keyStatus[i] = false;
      }

      /*
       * キーボードが押されたイベント
       * keyCode 37: 左矢印
       * keyCode 38: 上矢印
       * keyCode 39: 右矢印
       * keyCode 40: 下矢印
       */
      document.addEventListener('keydown', (e) => {
        keyStatus[e.keyCode - 37] = true;
      });
      document.addEventListener('keyup', (e) => {
        keyStatus[e.keyCode - 37] = false;
      });

      const checkInput = () => {
        let i;
        const KEY_LEFT  = 0;
        const KEY_UP    = 1;
        const KEY_RIGHT = 2;
        const KEY_DOWN  = 3;

        const hideAnimation = () => {
          for (i = 0; i < 4; i++) {
            elmAnimationCharacter[i].visible = false;
          }
        };

        if (keyStatus[KEY_LEFT]) {
          hideAnimation();
          elmAnimationCharacter[0].visible = true;
          elmCharacter.position.x -= 2;
        }
        if (keyStatus[KEY_UP]) {
          hideAnimation();
          elmAnimationCharacter[1].visible = true;
          elmCharacter.position.y -= 2;
        }
        if (keyStatus[KEY_RIGHT]) {
          hideAnimation();
          elmAnimationCharacter[2].visible = true;
          elmCharacter.position.x += 2;
        }
        if (keyStatus[KEY_DOWN]) {
          hideAnimation();
          elmAnimationCharacter[3].visible = true;
          elmCharacter.position.y += 2;
        }

        requestAnimationFrame(checkInput);
      };

      checkInput();

  });

  loader.load();

})();

