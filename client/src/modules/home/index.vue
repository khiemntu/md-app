<template>
  <div class="m-container">
    <div id="md-12" class="hide">
      <table>
        <tr class="row-1"><td><h1>{{prefix}} <span class="name">{{name}} </span></h1></td></tr>
        <tr class="row-2"><td><span class="info"><span>CONFIDENCE: {{conf}}</span><span style="margin-left: 30px;">TIME: {{time}}</span></span></td></tr>
      </table> 
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import io from 'socket.io-client';
// eslint-disable-next-line
import anime from 'animejs';
import _ from 'lodash';

export default {
  data() {
    return {
      isItem: [],
      isProcess: false,
      array: [],
      name: 'Buddy',
      prefix: 'Hey',
      conf: 'N/A',
      time: 'N/A',
      setences: [
        'Good morning',
        'Hellooo',
        'How are you today,',
        'How’s it going,',
        'Good to see you,',
        'Good afternoon',
        'How’s your day',
        'Hey, nice to see you'
      ],
      animates: [
        'bounce',
        'flash',
        'pulse',
        'rubberBand',
        'shake',
        'swing',
        'tada',
        'wobble',
        'jello'
      ]
    };
  },
  computed: {
    ...mapGetters('home', ['posts'])
  },
  watch: {
    isItem: function(nValue, oValue) {
      // eslint-disable-next-line
      console.log('Remaining ', this.array.length);
      if (nValue != oValue && nValue.length) {
        // eslint-disable-next-line
        // console.log(nValue, oValue);
        // init data to show
        let item = this.isItem[0];
        this.prefix = this.setences[Math.floor(Math.random() * 8) + 0];
        this.name = item.name;
        this.conf =
          item.oconf + ' (' + (item.delta > 0 ? '+' : '') + item.delta + ')';
        this.time = item.today;
        // animate
        let aime = this.animates[Math.floor(Math.random() * 9) + 0];
        // if (oValue.length == 0) {
        //   aime = 'bounceInDown';
        // }
        document.getElementById('md-12').className = aime + ' animated';
        setTimeout(() => {
          if (this.array.length == 0) {
            document.getElementById('md-12').className = 'bounceOutUp animated';
          }
          setTimeout(() => {
            if (this.array.length) {
              this.isItem = [this.array[0]];
              this.isProcess = true;
              this.array.splice(0, 1);
            } else {
              this.isProcess = false;
              this.isItem = [];
            }
          }, 200);
        }, 1000);
      }
    }
  },
  created() {
    const socket = io('http://10.0.18.16:8088');
    // eslint-disable-next-line
    console.log(socket);

    // tell server to execute 'new message' and send along one parameter
    socket.emit('message', 'Hello from the other side');

    // Whenever the server emits 'new message', update the chat body
    socket.on('data', data => {
      if (this.array.length == 0) {
        if (this.isProcess == false) {
          this.isItem = [data];
          this.isProcess = true;
        } else {
          let index = _.findIndex(this.array, item => {
            item.name == data.name;
          });
          if (index < -1) {
            this.array.push(data);
          }
        }
      } else {
        if (this.isProcess) {
          let index = _.findIndex(this.array, item => {
            item.name == data.name;
          });
          if (index < -1) {
            this.array.push(data);
          }
        } else {
          this.isItem = [this.array[0]];
          this.isProcess = true;
          this.array.splice(0, 1);
        }
      }
    });
  },
  methods: {
    ...mapActions('home', ['getList'])
  }
};
</script>

<style scoped>
.m-container {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  -webkit-animation: Gradient 15s ease infinite;
  -moz-animation: Gradient 15s ease infinite;
  animation: Gradient 15s ease infinite;
  overflow: hidden;
  height: 100%;
  color: #fff;
}

@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@font-face {
  font-family: 'Open Sans';
  src: url('~@/assets/fonts/OpenSans/OpenSans-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Teko';
  src: url('~@/assets/fonts/Teko/Teko-SemiBold.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
tr {
  text-align: center;
}
tr.row-1 {
  height: 45%;
}
tr.row-1 > td {
  vertical-align: bottom;
  margin: 0;
}
tr.row-2 > td {
  vertical-align: baseline;
  /* padding-top: 50px; */
}
table,
#md-12 {
  width: 100%;
  height: 100%;
}
#md-12 {
  transition: all 0.25s;
}
.hide {
  transform: translateY(-100%);
}
.show {
  transform: translateY(0);
}
span {
  font-family: 'Open Sans';
}
.name {
  /* font-weight: bold; */
  color: yellow;
}
.info {
  font-size: 30px;
  letter-spacing: 2px;
  opacity: 0.3;
}
h1 {
  font-family: 'Open Sans';
  font-weight: 300;
  text-align: center;
  font-size: 130px;
  margin: 0;
}
</style>
