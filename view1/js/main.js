var jobs_div=document.getElementById("jobs");
var subject1=document.getElementById("subject");
var company1=document.getElementById("company");
var ctc1=document.getElementById("ctc");
var skills1=document.getElementById("skills");
var desc1=document.getElementById("description");
var location1=document.getElementById("location");
var exp1=document.getElementById("exp");
var job_desc1=document.getElementById("job_desc");
var last_div=document.getElementById("last_div");
var cross=document.getElementById("cross");
//console.log(user.username);
var user=new Object();
get_user();
function get_user()
{
  var req=new XMLHttpRequest();
  req.onreadystatechange = function() 
  {
    if (this.readyState == 4 && this.status == 200) {
      user=JSON.parse(this.responseText);
      console.log(user);
    }; 
  };
  req.open("GET","/getuser",true);
  req.send();
}


var list=document.getElementById("upperlist");
var find=document.getElementById("find");
/*var f=1;
find.addEventListener("click",function()
{
    console.log("clicked");
    if(f==1)
    {
      document.getElementById("search").style.display="inline";
      f=0;
    } 
    else
    {
    document.getElementById("search").style.display="none";
    f=1;
    } 
});
var edit_btn=document.getElementById("edit");
edit_btn.addEventListener("click",function()
{
   var fds=document.getElementsByClassName("profile_input");
   console.log(fds.length);
   for(let z=0;z<=fds.length-1;z++)
   {
     fds[z].disabled="false";
   }
   edit_btn.value="Save";
});*/
onload();
var jobs;
function onload()
{
  console.log("called first");
  var req=new XMLHttpRequest();
  req.onreadystatechange = function() 
  {
    if (this.readyState == 4 && this.status == 200) {
      console.log("called"+this.responseText);
      jobs=JSON.parse(this.responseText);
      console.log(jobs);
      var total_jobs=jobs.length;
      for(let i=0;i<=total_jobs-1;i++)
      {
        jobs_div.appendChild(add_jobs(jobs[i]));
      }
    }; 
  };
  req.open("GET","/jobs",true);
  console.log(req);
  req.send();
}

function add_jobs(arr)
{
  var outerdiv=document.createElement("div");
  outerdiv.style.margin="auto";
  var sub=document.createElement("h2");
  sub.innerHTML=arr.subject;
  var desc=document.createElement("h4");
  desc.innerHTML=arr.desc;
  var ctc=document.createElement("label");
  ctc.innerHTML="CTC :-"+arr.ctc+"<br>";
  var skills=document.createElement("label");
  skills.innerHTML="Skills :-"+arr.skills+"<br>";
  var exp=document.createElement("label");
  exp.innerHTML="Exp:-"+arr.experience;
  var company=document.createElement("label");
  company.innerHTML=arr.company;
  var location=document.createElement("label");
  location.innerHTML=arr.location;
  outerdiv.style.borderRadius="10px";
  outerdiv.style.color="#23050e";
  outerdiv.style.margin="auto";
  outerdiv.appendChild(sub);
  outerdiv.appendChild(ctc);
  outerdiv.appendChild(skills);
  outerdiv.appendChild(exp);
  outerdiv.addEventListener("click",function()
  {
    let flag_applied=0;
    let flag_interest=0;
    company1.innerHTML="";
    subject1.innerHTML="";
    ctc1.innerHTML="";
    exp1.innerHTML="";
    skills1.innerHTML="";
    desc1.innerHTML="";
    location1.innerHTML="";
    job_desc1.style.display="block";
     company1.appendChild(company.cloneNode(true));
     subject1.appendChild(sub.cloneNode(true));
     ctc1.appendChild(ctc.cloneNode(true));
     exp1.appendChild(exp.cloneNode(true));
     skills1.appendChild(skills.cloneNode(true));
     desc1.appendChild(desc.cloneNode(true));
     location1.appendChild(location.cloneNode(true));
     let apply_btn=document.createElement("button");
     let already_applied=document.createElement("button");
     let already_interest=document.createElement("button");
     already_interest.className="button";
     already_interest.innerHTML="Added to interested";
     already_applied.innerHTML="Already applied";
     already_applied.className="button";
     let my_interest=document.createElement("button");
     last_div.innerHTML="";
     for(let app=0;app<=user.jobs_applied.length-1;app++)
     {
         if(user.jobs_applied[app]==arr.id)
         {
            flag_applied=1;
            console.log("applied jobs are "+arr.subject);
            break;
         }
     }
     console.log(user.interested.length);
     for(let app=0;app<=user.interested.length-1;app++)
     {
         if(user.interested[app]==arr.id)
         {
            flag_interest=1;
            console.log("interested jobs are "+arr.subject);
            break;
         }
     }
     if(flag_interest!=1&&flag_applied!=1)
     {
        last_div.appendChild(apply_btn);
        last_div.appendChild(my_interest);
     }
     else if(flag_interest==1&&flag_applied!=1)
     {
        last_div.appendChild(apply_btn);
        last_div.appendChild(already_interest);
     }
     else
     {
        last_div.appendChild(already_applied);
     }  
     apply_btn.innerHTML="Apply Now"
     apply_btn.className="button";
     my_interest.innerHTML="Add to see later";
     my_interest.className="button";
     apply_btn.addEventListener("click",function()
     {
      let xhttp=new XMLHttpRequest();
      xhttp.onreadystatechange = function() 
      {
      if(this.readyState == 4 && this.status == 200) 
      {
          console.log("called"+this.response)
          if(this.responseText)
          {
              var a=JSON.parse(this.responseText);
              console.log("a is "+this.responseText);
              if(a.result=="successful")
              {
                user.jobs_applied.push(arr.id);
                swal({
                  title: "Congratulations",
                  text: "applied successfully",
                  icon: "success",
                  button: "close",
              });     
              last_div.removeChild(apply_btn);
              if(flag_interest==1)
                 last_div.removeChild(already_interest);
              else   
                 last_div.removeChild(my_interest);
              last_div.appendChild(already_applied);    
              }
              else
              {
                  swal({
                    title: "Temporarily Failed",
                    text: "Please try again",
                    icon: "warning",
                    button: "Try Again..",
                }); 
              }
          }    
        }  
      };
      xhttp.open("GET","/append_job?id="+arr.id,true);
      xhttp.send();
     });
     my_interest.addEventListener("click",function()
     {
      let xhttp=new XMLHttpRequest();
      xhttp.onreadystatechange = function() 
      {
      if(this.readyState == 4 && this.status == 200) 
      {
          console.log("called"+this.response)
          if(this.responseText)
          {
              var a=JSON.parse(this.responseText);
              console.log("a is "+this.responseText);
              if(a.result=="successful")
              {
                user.interested.push(arr.id);
                console.log("now interested is "+user.interested);
                swal({
                  title: "Added successfully",
                  text: "Thanx for showing interest",
                  icon: "success",
                  button: "close",
              });
              last_div.removeChild(my_interest);
              last_div.appendChild(already_interest);         
              }
              else
              {
                  swal({
                    title: "Temporarily Failed",
                    text: "Please try again",
                    icon: "warning",
                    button: "Try Again..",
                }); 
              }
          }    
        }  
      };
      xhttp.open("GET","/interested_jobs?id="+arr.id,true);
      xhttp.send();
     });
  });
  return outerdiv;
}
var search=document.getElementById("find")
search.addEventListener("input",function(e)
{
  jobs_div.innerHTML="";
  e.preventDefault();
    console.log(jobs);
    console.log(search.value);
    for(let index=0;index<=jobs.length-1;index++)
    {
      if(((jobs[index].subject).toUpperCase()).includes((search.value).toUpperCase()))
      {
        jobs_div.appendChild(add_jobs(jobs[index]));
      }
    }
});

var filters=document.getElementsByClassName("side_list");
for(let fil=0;fil<=filters.length-1;fil++)
{
  filters[fil].addEventListener("change",function()
  {
    
    if(this.checked==true)
    {
      jobs_div.innerHTML="";
      for(let i=0;i<=jobs.length-1;i++)
      {
        let skill_length=jobs[i].skills.length;
        console.log(jobs[i].subject);
        console.log(jobs[i].skills);
        for(let j=0;j<=skill_length-1;j++)
        {
          console.log(filters[fil].value)
          if(jobs[i].skills[j].toUpperCase()==(filters[fil].value).toUpperCase())
          {
            jobs_div.appendChild(add_jobs(jobs[i]));
          }
        }
      }
    } 
      else{
        jobs_div.innerHTML="";
        onload();
      }
  });
}
cross.addEventListener("click",function()
{
  job_desc1.style.display="none";
});
