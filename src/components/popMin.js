class popMin{
    createPop(icon , text, big){
        if(document.querySelectorAll(".popMin").length){
            this.delete();
        }
        let el = document.createElement('div');
        el.className = "popMin animated " + big;
        el.innerHTML = '<span class="icon_imp '+ icon +'" ></span><p class="txt">'+ text +'</p>';
        return el;
    }
    show(icon , text , big = ''){
        let el = this.createPop(icon , text , big);
        el.classList.add('fadeIn');
        document.body.appendChild(el);
        setTimeout(() => {
            this.close();
        },2000);
    }
    close(){
        let elements = document.querySelectorAll('.popMin');
        for(let i=0;i<elements.length;i++){
            var el = elements[i];
            el.classList.remove('fadeIn');
            el.classList.add('fadeOut');
        }
        setTimeout(() => {
            this.delete();
        },1000);
        
    }
    delete(){
        let elements = document.querySelectorAll('.popMin');
        for(let i=0;i<elements.length;i++){
            var el = elements[i];
            // this.delete(elements[i]);
            el.parentNode.removeChild(el);
        }
    }
}
export default new popMin()