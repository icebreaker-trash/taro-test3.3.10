export class Line {
    containter = null
    width = 0
    height =0
    y = 0
    x = 0
    closed = false
    elements = []
    start = null
    end = null
    id = Math.random()
    constructor(){
        
    }
    bind(el){
        this.containter = el.parent
    }
}