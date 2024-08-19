const dataMethod = ["body","query","params","header","file","files"]



export const validation = (Schema)=>{


    return (req,res,next)=>{
        let arrayError =[]
        dataMethod.forEach((key)=>{
            if (Schema[key]) {
                const{error}=Schema[key].validate(req[key] ,{abortEarly:false})
                if (error?.details) {
                    error.details.forEach((err)=>{
                        arrayError.push(err.message)
                    })
                    
                }
                
            }

        })
        if (arrayError.length) {
            console.log(arrayError);
            return res.status(400).json({msg:"validation error" ,errors:arrayError})
        }

        next()
    }
}