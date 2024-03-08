


const postStory = async(req,res)=>{
    try{
       
        
        res.send(req.body.description)

        

       

    }catch(error){
        console.log(error)
    }
}


export {postStory}