import React, {Component} from "react";
import { Link } from 'react-router-dom'
import "./MyWells.css"
import Graph3D from "../Graph3D"
import Container from "../Container"
// const INITIAL_STATE={
//     currentWell:{},
//     userData:{},
//     wellData:{}
// }

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  });


  //just placing this sample data here for reference while creating the parseData function
//   [{"Depth (ft)":"(ft)","Incl (Deg)":"Deg.",
//   "Azim (Deg)":"Deg."},{"Depth (ft)":"","Incl (Deg)":"","Azim (Deg)":""},
//   {"Depth (ft)":"0","Incl (Deg)":"0","Azim (Deg)":"0"},{"Depth (ft)":"150",
//   "Incl (Deg)":"0.3","Azim (Deg)":"189.6"},


// "_id":"5bc53106eeeddb48d0c7d941","latitude":"859285755","longitude":"283759285","wellName":"test well revisited",
// "wellUWI":"2037532","wellLocation":"australia","pipeData":{"Yield":"75000","ToolJointOd":"6.625","ToolJointId":"3.5",
// "TensionBody":"530144","TensionJoint":"1109920","TorsionBody":"52257","TorsionJoint":"44673","MakeupTorque":"27076"},"__v":0

const parseStringDataToInt = (wellData) => {
    let checkForNoData = false;
    if(wellData[0].wellName=='no data'){
        checkForNoData=true;
    }
    return checkForNoData ?  wellData : wellData.map(e=>{
            let parsedSurveyData = e.surveyData.map(element=>{
            let depth = parseFloat(element["Depth (ft)"])
            let incl = parseFloat(element["Incl (Deg)"])
            let azim = parseFloat(element["Azim (Deg)"])
            let proceedWithPlan = true;
            if(isNaN(depth)||isNaN(incl)||isNaN(azim)){
                proceedWithPlan = false;
            }
            if(proceedWithPlan)
            {
                return {"Depth (ft)":depth,"Incl (Deg)":incl,"Azim (Deg)":azim}
            }
            return {"Depth (ft)":0,"Incl (Deg)":0,"Azim (Deg)":0}
            
        })
        e.surveyData=parsedSurveyData;
        //parse pipedata
        for(let x in e.pipeData.labTestedData)
        {
            e.pipeData.labTestedData[x] = parseFloat(e.pipeData.labTestedData[x])
        }
        for(let x in e.pipeData.wellProperties)
        {   
            let a =  parseFloat(e.pipeData.wellProperties[x])
            if(!isNaN(a))
            e.pipeData.wellProperties[x] = a;
        }


        e["latitude"] = parseFloat(e.latitude);
        e["longitude"] = parseFloat(e.longitude);
        return e;
    })

    
        
    }




class MyWells extends Component {
    constructor(props) {
        super(props);
        this.state = {    
        graph3d:false,
         currentWell:{surveyData:''},
        userData:JSON.parse(sessionStorage.getItem('userData')),
        wellData:parseStringDataToInt(JSON.parse(sessionStorage.getItem('wellData'))),
      }}
    
      

    render(){

        return (
            
            <div>
                 
                <hr></hr>
                {
                    this.state.wellData.map(element => 
                    <div>

                        <button onClick={()=>{
                        this.setState(byPropKey('currentWell',element));this.setState(byPropKey('graph3d',true))}}>{element.wellName}</button> <br /><br />

                    </div>
                    )
                    
                }

                {/* {JSON.stringify(this.state.currentWell)} */}
                { this.state.graph3d ? (<Graph3D surveyData={this.state.currentWell.surveyData} />):(<Container wellData={this.state.wellData}/>)}
                 {/* <Graph3D surveyData={this.state.currentWell.surveyData} /> */}
                    

            </div>
        )
    }

}

export default MyWells;
