// Route indexes per instruction. Empty phases show setup or a stationary technique.
// These mappings deliberately avoid animating an unrelated route on the next step.
export const phaseRoutes={
 warm:[[],[],[0,1,2]],form:[[],[],[0],[]],spots:[[],[],[],[]],handle:[[],[],[0],[]],slalom:[[],[0],[0],[]],slide:[[],[0],[0],[]],mirror:[[],[0,1],[],[]],pass:[[],[0,1],[],[]],sprint:[[],[0],[],[]],
 countdown:[[],[],[],[]],knockout:[[],[0,1],[2,3],[4,5],[0,1]],mikan:[[],[0],[1],[0,1]],reverse:[[],[0],[1],[]],layupR:[[],[0],[0],[]],layupL:[[],[0],[0],[]],free:[[],[],[0],[]],'free-pressure':[[],[0],[],[]],pullR:[[],[0],[1],[]],pullL:[[],[0],[1],[]],relocate:[[],[0,1],[2,3],[]],race:[[],[0,1,2,3],[],[]],horse:[[],[0],[0],[]],points:[[],[],[],[]],bank:[[],[0],[1],[0,1]],cross:[[],[0],[0],[]],between:[[],[0],[0],[]],behind:[[],[0],[0],[]],retreat:[[],[0],[1],[2]],zigzag:[[],[0,1],[0],[]],twoBalls:[[],[0,1],[0,1],[]],tag:[[],[0,1,2],[0],[]],weak:[[],[0],[0],[]],closeout:[[],[0],[],[]],contain:[[],[0],[1],[]],boxout:[[],[0,2],[1],[]],help:[[],[0],[1,2],[]],shell:[[],[0,1,2],[0,1,2],[]],deny:[[],[0],[1],[2]],dynamic:[[],[0],[0],[0]],passing:[[],[0],[],[0]],bounce:[[],[],[0],[]],weave:[[],[0,1],[2,3],[0,1,2,3]],balance:[[],[],[],[]],shuttle:[[],[0],[1],[]],squat:[[],[],[],[]],plank:[[],[],[],[]],hops:[[],[0],[0],[]],reaction:[[],[],[0,1],[]]
};

export const routeKinds={
 knockout:['shot','shot','move','shot','pass','move'],pass:['pass','shot'],relocate:['pass','move','pass','shot'],race:['pass','shot','pass','shot'],boxout:['shot','move','move'],help:['move','pass','move'],shell:['pass','pass','pass'],deny:['move','move','pass'],weave:['pass','move','pass','move'],cross:['ball'],between:['ball'],behind:['ball'],twoBalls:['ball','ball']
};
