export function getWebviewContent(pluginsAr): string {
  // Define an array of binary locations (for demonstration)

  // Generate the HTML content

  function plugin_html(plg, idx) {
    return `
        <form class="p-3">
            <div class="row g-3 align-items-center">
                <div class="col-auto">
                    <label for="exampleInputEmail1" class="form-label">Plugin Name</label>
                </div>
                <div class="col-auto">
                    <input type="text" class="form-control" name="name" aria-describedby="emailHelp" value="${plg.getName()}" >
                </div>
                <div class="col-auto">
                    <label for="exampleInputEmail1" class="form-label">Plugin Path</label>
                </div>
                <div class="col-auto">
                    <input type="text" class="form-control" name="path" aria-describedby="emailHelp" value="${plg.getPath()}">
                </div>
                
            
            <div class="col-auto">
                <label class="form-check-label" for="exampleCheck1">Active</label>
                <input type="checkbox" class="form-check-input"  name="active" ${
                  plg.getState() ? "checked" : ""
                }>
            </div>
           
          <div class="col-auto">
               <label for="exampleInputEmail1" class="form-label">Plugin On Trigger</label>
            </div>
            <div class="col-auto">
              <div class="dropdown">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    On Triggers
                </a>

                <ul class="dropdown-menu">
                    <div><a ${
                      plg.getOnTrigger().includes("Save") ? "selected" : ""
                    }class="dropdown-item" href="#">On Save</a></div>
                    <div><a ${
                      plg.getOnTrigger().includes("Change") ? "selected" : ""
                    }class="dropdown-item" href="#">On Change</a></div>
                    <div><a ${
                      plg.getOnTrigger().includes("Create") ? "selected" : ""
                    }class="dropdown-item" href="#">On Create</a></div>
                </ul>
                </div>
            </div>
            </div>
            <div class="container-lg mt-3">
                <div class="table-responsive">
                    <div class="table-wrapper" onload="create_event()">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Keys</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="table_body_${idx}">
                            ${plg
                              .getArg()
                              .map(
                                (
                                  value
                                ) => ` <tr><td><input type="text" name="keys" class="form-control" value="${value["key"]}"></td>
                                <td><input type="text" name="value" class="form-control" value="${value["value"]}"></td>
                                <td><button title="Delete" class="btn btn-info">Delete</button></td></tr>
                                `
                              )
                              .join("")}
                               
                            </tbody>
                        </table>
                        <div class="col-sm-4">
                            <button id="add_new_${idx}" type="button" class="btn btn-info add-new" onclick="add_new('${idx}');"><i class="fa fa-plus"></i>Add
                                New Arguments</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        `;
  }
  const plugins = pluginsAr
    .map(
      (plg, idx) =>
        `<li  class="list-group-item mb-5"> ${plugin_html(plg, idx)} </li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Plugins Manager</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
      </head>
   
   <body>
      <h2>Plugins Manager Settings</h2>
     
      <h4> Added Plugins</h4>
      <ul id="listOfPlugins" class="list-group">
         ${plugins}
      </ul>
      <button type="submit" id="changeData" onclick="addPluginBtn();" class="btn btn-primary">Add Plugin</button>
      <button onclick="myFunction();" class="btn btn-primary">Save Setting</button>
      <script>
         let vscode = acquireVsCodeApi();

            let idx = document.getElementById('listOfPlugins').querySelectorAll('li').length;

         function plugin_html(idx) {
        return \`
        <form class="p-3">
            <div class="row g-3 align-items-center">
                <div class="col-auto">
                    <label for="exampleInputEmail1" class="form-label">Plugin Name</label>
                </div>
                <div class="col-auto">
                    <input type="text" class="form-control" name="name" aria-describedby="emailHelp" value="" >
                </div>
                <div class="col-auto">
                    <label for="exampleInputEmail1" class="form-label">Plugin Path</label>
                </div>
                <div class="col-auto">
                    <input type="text" class="form-control" name="path" aria-describedby="emailHelp" value="">
                </div>
                
            
            <div class="col-auto">
                <label class="form-check-label" for="exampleCheck1">Active</label>
                <input type="checkbox" class="form-check-input"  name="active" checked>
            </div>
           
          <div class="col-auto">
               <label for="exampleInputEmail1" class="form-label">Plugin On Trigger</label>
            </div>
            <div class="col-auto">
              <div class="dropdown">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    On Triggers
                </a>

                <ul class="dropdown-menu">
                    <div><a selected class="dropdown-item" href="#">On Save</a></div>
                    <div><a class="dropdown-item" href="#">On Change</a></div>
                    <div><a class="dropdown-item" href="#">On Create</a></div>
                </ul>
                </div>
            </div>
            </div>
            <div class="container-lg mt-3">
                <div class="table-responsive">
                    <div class="table-wrapper" onload="create_event()">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Keys</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="table_body_\`+idx+\`">
                            </tbody>
                        </table>
                        <div class="col-sm-4">
                            <button id="add_new_\`+idx+\`" type="button" class="btn btn-info add-new" onclick="add_new(\`+idx+\`);"><i class="fa fa-plus"></i>Add
                                New Arguments</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        \`;
        }

        function add_new(id) {
            function remove_row() {
                this.parentElement.parentElement.remove();
            }
            

            let tr = document.createElement("tr");
            let td = document.createElement("td");
            let input = document.createElement("input");
            input.type = "text";
            input.name = "keys";
            input.classList.add("form-control");
            td.appendChild(input);
            tr.appendChild(td);

            td = document.createElement("td");
            input = document.createElement("input");
            input.type = "text";
            input.name = "value";
            input.classList.add("form-control");
            td.appendChild(input);
            tr.appendChild(td);

            td = document.createElement("td");
            let button = document.createElement("button");
            button.title = "Delete";
            button.onclick = remove_row;
            button.classList.add("btn");
            button.classList.add("btn-info");
            let text = document.createTextNode("Delete");
            button.appendChild(text);
            td.appendChild(button);
            tr.appendChild(td);

            let element = document.getElementById("table_body_"+id);
            element.appendChild(tr);
        }

        function get_information(id){
            let t = document.getElementById("table_body_"+id).children;
            let info = {};
            for(let i=0; i<t.length; i++){
                let child = t[i].children;
                let child0 = child[0].children[0].value;
                let child1 = child[1].children[0].value;
                if ( child0 != "" && child1 != "" && !(child0 in info) ) {
                    info[child0] = [child1];
                } else {
                    return [false, {}]
                }
            }
            return [true, info]
        }


        function addPluginBtn(){
             let ul = document.getElementById('listOfPlugins');
             
                 vscode.postMessage({
                 command: 'alert',
                 text: ul.outerHTML
             })

            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.classList.add("mb-5");
            li.classList.add('border');
            idx += 1;
             
         
             ul.appendChild(li);
             let t = document.getElementById('listOfPlugins').children.length;
             document.getElementById('listOfPlugins').children[t-1].innerHTML = plugin_html(idx);
             
        }
         function updatePreview(idx) {
            const htmlInput = document.getElementById('htmlInput'+idx).value;
            const preview = document.getElementById('preview'+idx);
            
            // Create a new list item and append user input and preview message
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = htmlInput + ' <span class="badge badge-primary">Preview</span>';
            
            // Append the list item to the preview list
            preview.appendChild(listItem);
             vscode.postMessage({
                 command: 'alert',
                 text: innerHTML
             })

         }

         function addPLugin(){

         let form = document.getElementById('add');
    
             const dataArray = [];
             vscode.postMessage({
                 command: 'alert',
                 text: '🐛  on line added'
             })
             
                 const inputElements = form.querySelectorAll('input');
                 const dataObject = {};
         
               
                     dataObject['name'] = inputElements[0].value;
                     dataObject['path'] = inputElements[1].value;
                     dataObject['active'] = (inputElements[2].value == 'on') ?true:false;

                     dataObject['onTrigger'] = inputElements[2].value;
         
                     dataObject['arguments'] = inputElements[3].value;
                
         
                 dataArray.push(dataObject);
         
             
         }
         function myFunction() {
            
         let ul = document.getElementById('listOfPlugins');
             const liElements = ul.querySelectorAll('li');
             const dataArray = [];
             vscode.postMessage({
                 command: 'alert',
                 text: '🐛  on line ' + liElements.length + ':'+ul
             })
             
             for (let i = 0; i < liElements.length; i++) {
                 const form = liElements[i].querySelector('form');
                 const inputElements = form.querySelectorAll('input');
                 const dataObject = {};
         
               
                     dataObject['name'] = inputElements[0].value;
                     dataObject['path'] = inputElements[1].value;
                    
                     dataObject['active'] = (inputElements[2].value == 'on') ?true:false;
         
                    let t = document.getElementById("table_body_"+i).children;
                    let info = [];
                    for(let i=0; i<t.length; i++){
                        let child = t[i].children;
                        let child0 = child[0].children[0].value;
                        let child1 = child[1].children[0].value;
                        if ( child0 != "" && child1 != "" && !(child0 in info) ) {
                            let temp = {};
                            temp['key']=child0
                            temp['value'] = [child1];
                            info.push(temp);
                        } else {
                            return [false, {}]
                        }
                    }


                     dataObject['arguments'] = info;
                    dataObject['onTrigger'] = ["Save"];
                
         
                 dataArray.push(dataObject);
         
             }
             
         
             // Send selected locations back to the extension
             vscode.postMessage({
                 command: 'saveLocations',
                 locations: dataArray
             });
         
            
         }
         
      </script>
   </body>
</html>
    `;
}
