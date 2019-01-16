//@ts-check
var noop =function(){};
import {Observer} from './observer';
import  Watcher  from "./watcher";
var vm={
    _watchers:[],
    data :{
        name:'jack',
        age:12
    }
    // render:new Function("with(this){return _c('div',{attrs:{\"id\":\"app\"}},[_v(_s(name))])}")
}
new Observer(vm.data);

new Watcher(vm,function(){
    //update function 
    var name=vm.data.name;
    var age=vm.data.age;
    console.log(name,age)
},noop);
setTimeout(()=>{
    vm.data.name='lucy';
    vm.data.age=10;
    vm.data.name='lili';
},1000)
// 'beforeCreate'
// initData()
// 'created'
// $mount
// compileTemplateToRenderFunction  render bind deps  ast render 
// beforeMount
// updateComponentFunction 
// new Watcher() //thi.get(); 
// update
// mounted 

// Class 