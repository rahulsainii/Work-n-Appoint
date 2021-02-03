const express=require("express");
const fs=require("fs");
const path=require("path");
const bodyParser = require('body-parser');
var multer=require("multer");
const app=express();
const session=require("express-session");

app.use(bodyParser.json());
//app.use(sessionchecker);
app.use(express.static("view1"));
app.set("view engine","ejs");
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({
    extended:true
  }));

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));


  var multer_config=multer.diskStorage(
      {
        destination:__dirname+"/view1/images",
        filename:function(req,file,cb)
        {
          cb(null,req.session.user.emailid+req.session.user.flag+file.originalname+path.extname(file.originalname));
        }  
    });


var upload=multer(
    {
        storage:multer_config 
    });


  function fetch_data(pathdata,callback)
  {
      let rawdata = fs.readFile(path.resolve(__dirname, './'+pathdata),'utf-8',function(err,data)
                                                                             {
                                                                                if(err)
                                                                                {
                                                                                    console.log("having an error");
                                                                                }
                                                                                else
                                                                                {
                                                                                    //console.log("find ");
                                                                                    if(data=="[]")
                                                                                       callback(data);
                                                                                    else   
                                                                                        callback(JSON.parse(data.toString()));
                                                                                }
                                                                            });   
  };
  function update_file(user,path_of_file,callback)
  {
    fetch_data(path_of_file,function(data)
    {
        console.log(user.jobs_posted+" postes jobs are here");
        let n=data.length;
        for(let index=0;index<=n-1;index++)
        {
            if(data[index].emailid==user.emailid)
            {
                console.log("emails are "+data[index].emailid+"  "+user.emailid)
                  data.splice(index,1);
                  data.push(user);
                  break;
            }
        }
        fs.writeFile(path_of_file,JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            callback(err);
                        }
                        else
                        {
                            console.log("sucessfull");
                            console.log(data);
                            callback("successfull");
                        }
                    });
    })  
  }






function check_session(req,res,next)
{
    if(req.session.user)
    {
        next();
    }
    else
    {

       res.render("login");
    }
} 
 
app.get("/",(req,res)=>{
    if(req.session.user)
    {
       if(req.session.user.flag==1)
       {
           res.render("main_home_company",{user:req.session.user});
       }
       else
       {
          res.render("main_home",{user:req.session.user});
       }
    }
    else
    {
        res.render("first_home");
    }   
});

app.get("/addnewjob",check_session,(req,res,next)=>
{
    res.render("AddNewJob")
});    
app.get("/main_home",check_session,(req,res,next)=>
{
    res.render("main_home",{"user":req.session.user});
});
app.get("/main_home_company",check_session,(req,res,next)=>
{
    res.render("main_home_company",{"user":req.session.user});
});

app.get("/login",(req,res)=>
{
    res.render("login");
});

app.get("/signup_btn",(req,res)=>
{
   res.render("newsignup");
});

app.get("/company_profile",check_session,(req,res)=>
{
    res.render("company_profile",{user:req.session.user});
});
    var i=0;

    app.get("/login_user",(req,res)=>{
        fetch_data("/database/users.json",function(data)
        {
            console.log(data+" = "+i++);
            console.log("req.body.data "+req.body.data);
            console.log("data.length is "+data.length);
            let email=req.param("email");
            console.log("email you entered id "+email);
            let password=req.param("password");
            console.log("password you entered is "+password);
            var flag=0;
            for(let i=0;i<=data.length-1;i++)
            {
               console.log("data[i] is "+data[i]);
               if(email==data[i].emailid)
               {
                   flag=1;
                   if(password==data[i].password)
                   {
                       console.log("user present ");
                       res.type('json');
                       req.session.user=data[i];
                       res.status(200).send({"result":"successfull"});
                       //res.render("home2");
                       break;
                   }
                   else
                   {
                       res.type('json');
                       res.status(200).send({"result":"Wrong password"});
                       break;
                   }
               }
            }
            if(flag==0)
               res.status(200).send({"result":"user not present"});
        });
    });

    app.get("/login_company",(req,res)=>{
        fetch_data("/database/companies.json",function(data)
        {
            console.log("compnay_login");
            console.log("req.body.data "+req.body.data);
            console.log("data.length is "+data.length);
            let email=req.param("email");
            console.log("email you entered id "+email);
            let password=req.param("password");
            console.log("password you entered is "+password);
            let flag=0;
            for(let i=0;i<=data.length-1;i++)
            {
               console.log("data[i] is "+data[i].emailid+" and "+email);
               if(email==data[i].emailid)
               {
                   flag=1;
                   if(password==data[i].password)
                   {
                       console.log("user present ");
                       res.type('json');
                       req.session.user=data[i];
                       res.status(200).send({"result":"successfull"});
                       //res.redirect("/home2.html");
                       break;
                   }
                   else
                   {
                       res.type('json');
                       res.status(200).send({"result":"Wrong password"});
                       break;
                   }
               }
            }
            if(flag==0)
               res.status(200).send({"result":"user not present"});
        });
    });

    app.get("/forget_user",(req,res)=>
        {
            fetch_data("/database/users.json",function(data)
            {
                let email=req.param("email");
                for(let i=0;i<=data.length-1;i++)
                {
                  console.log("data[i] is "+data[i]);
                  if(email==data[i].emailid)
                   {
                      res.type('json');
                      res.status(200).send({"result":'"'+data[i].password+'"'});
                      //res.redirect("/home2.html");
                      break;
                   }
                   else
                   {
                       res.type('json');
                       res.status(200).send({"result":"Wrong Email"});
                       break;
                   }
                }
            });
        });   

        app.get("/forget_company",(req,res)=>
        {
            fetch_data("/database/companies.json",function(data)
            {
                let email=req.param("email");
                for(let i=0;i<=data.length-1;i++)
                {
                  console.log("data[i] is "+data[i]);
                  if(email==data[i].emailid)
                   {
                      res.type('json');
                      res.status(200).send({"result":'"'+data[i].password+'"'});
                      //res.redirect("/home2.html");
                      break;
                   }
                   else
                   {
                       res.type('json');
                       res.status(200).send({"result":"Wrong Email"});
                       break;
                   }
                }
            });
        });   


    app.get("/jobs",function(req,res){
        fetch_data("/database/jobs.json",function(data)
        {
           res.send(data);
        });  
    });


    app.get("/get_applied",check_session,function(req,res){
        fetch_data("/database/users.json",function(data1)
        {
            fetch_data("/database/jobs.json",function(data)
            {
                //console.log("data1 is "+data1[data1.length-1].emailid);
                for(let u=0;u<data1.length;u++)
                {
                    if(data1[u].emailid===req.session.user.emailid)
                    {

                        //console.log(data1[u].emailid+" equal ids "+req.session.user.emailid);
                        let f=0;
                        let final_data=[];
                        let arr=data1[u].jobs_applied;
                        if(arr)
                        {
                            //console.log("data is "+arr);
                            let len=arr.length;
                            for(let index=0;index<=len-1;index++)
                            {
                                for(let j=0;j<=data.length;j++)
                                {
                               //     console.log("here data[j] is "+data[j].id+" and "+arr[index])
                                    if(data[j].id==arr[index])
                                    {
                                    final_data.push(data[j]);
                                     break;
                                    }
                                }
                            }
                            res.send({"result":final_data});
                        }
                        else
                        {
                            res.send({"result":"nothing"});
                        }
                        break;
                    }    
                }        
           });
        });         
    });     

    
    app.get("/get_interested",check_session,function(req,res){
            fetch_data("/database/users.json",function(data1)
            {
                fetch_data("/database/jobs.json",function(data)
                {
                    for(let u=0;u<data1.length;u++)
                    {
                        if(data1[u].emailid==req.session.user.emailid)
                        {
                           // console.log("equal ids");
                            let f=0;
                            let final_data=[];
                            let arr=data1[u].interested;
                            if(arr)
                            {
                                console.log("data is "+data);
                                let len=arr.length;
                                for(let index=0;index<=len-1;index++)
                                {
                                    for(let j=0;j<=data.length;j++)
                                    {
                             //           console.log("here data[j] is "+data[j].id+" and "+arr[index])
                                        if(data[j].id==arr[index])
                                        {
                                          final_data.push(data[j]);
                                          break;
                                        }
                                    }
                                }

                                res.send({"result":final_data});
                            }
                            else
                            {
                                res.send({"result":"nothing"});
                            }
                            break;
                        }    
                    }        
               });
            });      
        });

        app.get("/get_interested_company",check_session,function(req,res){
            fetch_data("/database/companies.json",function(data1)
            {
                fetch_data("/database/jobs.json",function(data)
                {
                    for(let u=0;u<data1.length;u++)
                    {
                        if(data1[u].emailid==req.session.user.emailid)
                        {
                           // console.log("equal ids");
                            let f=0;
                            let final_data=[];
                            let arr=data1[u].interested;
                            if(arr)
                            {
                                console.log("data is "+data);
                                let len=arr.length;
                                for(let index=0;index<=len-1;index++)
                                {
                                    for(let j=0;j<=data.length;j++)
                                    {
                             //           console.log("here data[j] is "+data[j].id+" and "+arr[index])
                                        if(data[j].id==arr[index])
                                        {
                                          final_data.push(data[j]);
                                          break;
                                        }
                                    }
                                }

                                res.send({"result":final_data});
                            }
                            else
                            {
                                res.send({"result":"nothing"});
                            }
                            break;
                        }    
                    }        
               });
            });      
        });     
        
        app.get("/get_applied_company",check_session,function(req,res){
            fetch_data("/database/companies.json",function(data1)
            {
                fetch_data("/database/jobs.json",function(data)
                {
                    //console.log("data1 is "+data1[data1.length-1].emailid);
                    for(let u=0;u<data1.length;u++)
                    {
                        if(data1[u].emailid===req.session.user.emailid)
                        {
    
                            //console.log(data1[u].emailid+" equal ids "+req.session.user.emailid);
                            let f=0;
                            let final_data=[];
                            let arr=data1[u].jobs_applied;
                            if(arr)
                            {
                                //console.log("data is "+arr);
                                let len=arr.length;
                                for(let index=0;index<=len-1;index++)
                                {
                                    for(let j=0;j<=data.length;j++)
                                    {
                                   //     console.log("here data[j] is "+data[j].id+" and "+arr[index])
                                        if(data[j].id==arr[index])
                                        {
                                        final_data.push(data[j]);
                                         break;
                                        }
                                    }
                                }
                                res.send({"result":final_data});
                            }
                            else
                            {
                                res.send({"result":"nothing"});
                            }
                            break;
                        }    
                    }        
               });
            });         
        });     
        
        app.get("/get_posted",(req,res,next)=>
        {
            fetch_data("/database/companies.json",function(data1)
            {
                fetch_data("/database/jobs.json",function(data)
                {
                    //console.log("data1 is "+data1[data1.length-1].emailid);
                    for(let u=0;u<data1.length;u++)
                    {
                        if(data1[u].emailid===req.session.user.emailid)
                        {
    
                            //console.log(data1[u].emailid+" equal ids "+req.session.user.emailid);
                            let f=0;
                            let final_data=[];
                            let arr=data1[u].jobs_posted;
                            if(arr)
                            {
                                //console.log("data is "+arr);
                                let len=arr.length;
                                for(let index=0;index<=len-1;index++)
                                {
                                    for(let j=0;j<=data.length-1;j++)
                                    {
                                   //     console.log("here data[j] is "+data[j].id+" and "+arr[index])
                                        if(data[j].id==arr[index])
                                        {
                                        final_data.push(data[j]);
                                         break;
                                        }
                                    }
                                }
                                res.send({"result":final_data});
                            }
                            else
                            {
                                res.send({"result":"nothing"});
                            }
                            break;
                        }    
                    }        
               });
            });         
           
        });
    
    
    
    
    
        app.post("/signup",(req,res)=>{
            let user=req.body;
            //a=JSON.parse(a);
            console.log(req.body);
           fetch_data("/database/users.json",function(data)
           { 
                let f=1;
                //console.log("j is "+j);
                console.log("length "+data.length);
                for(let index=0;index<=data.length-1;index++)
                {
                    console.log("data[i] is "+data[index].emailid);
                    if(data[index].emailid==user.emailid)
                    {
                        res.status(200).send({"result":"user already present"});
                        f=0;
                        break;
                    }
                }
                if(f==1)
                {
                    user.jobs_applied=[];
                    user.interested=[];
                    user.img="/images/icon.png";
                    data.push(user);
                    //console.log("j is "+j);
                    fs.writeFile("./database/users.json",JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            console.log(err);
                            console.log("error");
                        }
                        else
                        {
                            console.log("written to file successfully");
                            res.send({"result":"successful"});
                        }
                    });
                }
          });    
  });

 

  app.post("/addcompany",(req,res)=>{
            let user=req.body;
            //a=JSON.parse(a);
            console.log(req.body);
           fetch_data("./database/companies.json",function(data)
           { 
                //console.log("j is "+j);
                let f1=0;
                console.log("length "+data.length);
                for(let index=0;index<=data.length-1;index++)
                {
                    console.log("data[i] is "+data[index].emailid);
                    if(data[index].emailid==user.emailid)
                    {
                        res.status(200).send({"result":"user already present"});
                        f1=1;
                        break;
                    }
                }
                if(f1==0)
                {
                    user.jobs_applied=[];
                    user.interested=[];
                    user.jobs_posted=[];
                    user.inactive_jobs=[];
                    user.img="/images/icon.png";
                    data.push(user);
                    //console.log("j is "+j);
                    fs.writeFile("./database/companies.json",JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            console.log(err);
                            console.log("error");
                        }
                        else
                        {
                            console.log("written to file successfully");
                            res.send({"result":"successful"});
                        }
                    });
                }    
          }); 
});
  app.post("/addjob",check_session,function(req,res)
  {
      var addflag=0;
      console.log(req.body);
      let obj=req.body;
      fetch_data("/database/jobs.json",function(data)
      {
          console.log(data);
          obj.id=data.length+1;
          obj.company=req.session.user.company_name;
          obj.applicants=[];
          obj.status=1;
          data.push(obj);
            fs.writeFile("./database/jobs.json",JSON.stringify(data),"utf-8",(err)=>
            {
               if(err)
               {
                   console.log("error");
                   addflag=0;
                   res.status(200).send({"result":""+addflag+""});
               }
               else{
                    console.log("written to file successfully");
                    req.session.user.jobs_posted.push(obj.id);
                    update_file(req.session.user,"./database/companies.json",function(update_status)
                    {
                       if(update_status=="successfull")
                       {
                         addflag=1;  
                         res.status(200).send({"result":""+addflag+""});
                       }
                       else
                       {
                         res.status(200).send({"result":""+addflag+""});
                       }    
                    });
               }
            });
      });
  });
  

  app.get("/append_job",function(req,res,next)
  {
     if(req.session.user)
     {
         next();
     }
     else
     {
         res.status(200).send({"result":"please login first"});
     }
  },function(req,res,next){
    fetch_data("./database/users.json",function(data)
    { 
        let s=0;
         let id=req.param("id");
         console.log("length "+data.length+" id is "+id);
         for(let index=0;index<=data.length-1;index++)
         {
             if(data[index].emailid==req.session.user.emailid)
             {
                 console.log(data[index].emailid+"==="+req.session.user.emailid);
                 data[index].jobs_applied.push(id);
                 req.session.user.jobs_applied.push(id);
                 for(let i=0;i<=data[index].interested.length-1;i++)
                 {
                     if(data[index].interested[i]==id)
                     {
                         console.log("present in interested");
                         data[index].interested.splice(i,1);
                     }
                 }
                 console.log(data[index].jobs_applied)
                 break;
             }
         }
         fetch_data("./database/jobs.json",function(data1)
         {
             for(let i=0;i<=data1.length-1;i++)
             {
                 if(data1[i].id==id)
                 {
                     let obj=new Object();
                     obj.emailid=req.session.user.emailid;
                     obj.flag=req.session.user.flag;
                     data1[i].applicants.push(obj);
                 }
             }
             fs.writeFile("./database/jobs.json",JSON.stringify(data1),"utf-8",(err)=>
             {
                 if(err)
                 {
                    s=0;     
                 }
                 else
                 {
                    s=1;
                    console.log("written back to file successfully");
                 }
             });
             fs.writeFile("./database/users.json",JSON.stringify(data),"utf-8",(err)=>
             {
                 if(err)
                 {
                     res.send({"result":"Temporarily failed"})
                 }
                 else if(s==1)
                 {
                     //console.log("written to file successfully");
                     res.send({"result":"successful"});
                 }
             });
         });
  })});


  

  app.get("/company_append_job",function(req,res,next)
  {
     if(req.session.user)
     {
         next();
     }
     else
     {
         res.status(200).send({"result":"please login first"});
     }
  },function(req,res,next){
    fetch_data("./database/companies.json",function(data)
    { 
         let id=req.param("id");
         console.log("length "+data.length+" id is "+id);
         for(let index=0;index<=data.length-1;index++)
         {
             if(data[index].emailid==req.session.user.emailid)
             {
                 console.log(data[index].emailid+"==="+req.session.user.emailid);
                 data[index].jobs_applied.push(id);
                 req.session.user.jobs_applied.push(id);
                 for(let i=0;i<=data[index].interested.length-1;i++)
                 {
                     if(data[index].interested[i]==id)
                     {
                         console.log("present in interested");
                         data[index].interested.splice(i,1);
                     }
                 }
                 console.log(data[index].jobs_applied)
                 break;
             }
         }
         fs.writeFile("./database/companies.json",JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            res.send({"result":"Temporarily failed"})
                        }
                        else
                        {
                            //console.log("written to file successfully");
                            res.send({"result":"successful"});
                        }
                    });
  })});




  app.get("/interested_jobs",function(req,res,next)
  {
     if(req.session.user)
     {
         next();
     }
     else
     {
         res.status(200).send({"result":"please login first"});
     }
  },function(req,res,next){
    fetch_data("./database/users.json",function(data)
    { 
         let id=req.param("id");
         //console.log("length "+data.length);
         for(let index=0;index<=data.length-1;index++)
         {
             if(data[index].emailid==req.session.user.emailid)
             {
                 console.log(data[index].emailid+"==="+req.session.user.emailid);
                 data[index].interested.push(id);
                 req.session.user.interested.push(id);
                 break;
             }
         }
         fs.writeFile("./database/users.json",JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            res.send({"result":"Temporarily failed"})
                        }
                        else
                        {
                            //console.log("written to file successfully");
                            res.send({"result":"successful"});
                        }
                    });
  })
});

app.get("/company_interested_jobs",function(req,res,next)
  {
     if(req.session.user)
     {
         next();
     }
     else
     {
         res.status(200).send({"result":"please login first"});
     }
  },function(req,res,next){
    fetch_data("./database/companies.json",function(data)
    { 
         let id=req.param("id");
         //console.log("length "+data.length);
         for(let index=0;index<=data.length-1;index++)
         {
             if(data[index].emailid==req.session.user.emailid)
             {
                 console.log(data[index].emailid+"==="+req.session.user.emailid);
                 data[index].interested.push(id);
                 break;
             }
         }
         fs.writeFile("./database/companies.json",JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            res.send({"result":"Temporarily failed"})
                        }
                        else
                        {
                            //console.log("written to file successfully");
                            res.send({"result":"successful"});
                        }
                    });
  })
});




  app.post("/uploadimage",upload.single("pic"),function(req,res,next)
  {
    let p;  
    fetch_data("./database/users.json",function(data)
    { 
        for(let k=0;k<=data.length-1;k++)
        {
            console.log(data[k].emailid+" and "+req.session.user.emailid);
            if(data[k].emailid==req.session.user.emailid)
            {
              data[k].img="/images/"+req.file.filename;
              console.log("path is "+data[k].img);
              req.session.user.img=data[k].img;
              break;
            }
        }
    fs.writeFile("./database/users.json",JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            console.log("error");
                        }
                        else
                        {
                            console.log("written to file successfully");
                            res.redirect("/profile");
                        }
                    });

  })});

  app.post("/uploadimage_company",upload.single("pic"),function(req,res,next)
  {
    let p;  
    fetch_data("./database/companies.json",function(data)
    { 
        for(let k=0;k<=data.length-1;k++)
        {
            console.log(data[k].emailid+" and "+req.session.user.emailid);
            if(data[k].emailid==req.session.user.emailid)
            {
              data[k].img="/images/"+req.file.filename;
              console.log("path is "+data[k].img);
              req.session.user.img=data[k].img;
              break;
            }
        }
    fs.writeFile("./database/companies.json",JSON.stringify(data),"utf-8",(err)=>
                    {
                        if(err)
                        {
                            console.log("error");
                        }
                        else
                        {
                            console.log("written to file successfully");
                            res.redirect("/profile");
                        }
                    });

  })});



  app.get("/profile",check_session,(req,res,next)=>
  {
      res.render("profile.ejs",{"user":req.session.user});
  });


  app.get("/logout",check_session,(req,res,next)=>
  {
    req.session.destroy(function(err) {
        if(err)
        {
            res.send({"result":"unsuccessful"})
        }
        else{
            res.send({"result":"successful"})
        }
      });
  });
  app.get("/getuser",(req,res)=>
  {
     res.send(req.session.user);
  });
app.listen(3000,()=>
{
    console.log("listening");
});
