import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { PAGE_SETUP_JSON } from './modals';
declare var require: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  // FOR STORE THE VALUE .JRXML FILE 
  fileToUpload: any;

  // APPLICATION HEADER
  title = 'JASPER REPORT';

  // GET PAGE SETUP JSON FROM MODALS
  json = PAGE_SETUP_JSON;

  // THE VALUE IS FOR THE PREVIEW OPTION SHOW AND HIDE
  is_print = true;

  // FORM DECLRATION
  formGroup = this.fb.group({
    file: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private http: Http,
  ) { }


  // FIRE EVENT WHEN PICK THE FILE
  onFileChange(event) {

    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {

      const [file] = event.target.files;

      reader.readAsDataURL(file);

      reader.onload = () => {

        this.formGroup.patchValue({
          file: reader.result
        });

      };

    }

  }


  // WHEN SUBMIT BUTTON CLICK THE GET TAGS FROM THE JRXML FILE.
  getTags() {

    // HTTTP CALLING FOR THE VALUE OF THE FILE.
    this.http.get(this.formGroup.value.file).subscribe((jrxml: any) => {

      // replace the value of <![CDATA[Email]]> to Email.
      jrxml = (jrxml._body).replace(/<!/g, "").replace(/]]>/g, "").replace(/[CDATA]/g, "").replace(/[[[]/g, "");


      // this variable store the type when the text tag will be open.
      let tag_type: string;

      // this variable store the true false when the root tag is open or close.
      let flag: boolean = false;

      // this varible remind the index of the page setup for store specic type tag value.
      let index = 0;

      // parsing the jrxml to get the each tag value
      let htmlparser = require('htmlparser2');

      let parser = new htmlparser.Parser({

        onopentag: (name, attribs) => {

          // for open tag type 'text'.Inside the jrxml two tags available for store the text,first one is <one> tag and second one is <textfieldexpression>
          if (name === 'text') {
            tag_type = name;
          } else if (name === 'textfieldexpression') {
            tag_type = name;
          }


          // for tag <jasperreport> will goes for page setup like A4,B2 etc
          if (name === 'jasperreport') {
            PAGE_SETUP_JSON[0]['pageHeight'] = attribs.pageheight;
            PAGE_SETUP_JSON[0]['pageWidth'] = attribs.pagewidth;
            PAGE_SETUP_JSON[0]['columnWidth'] = attribs.columnwidth;
            PAGE_SETUP_JSON[0]['leftMargin'] = attribs.leftmargin;
            PAGE_SETUP_JSON[0]['rightMargin'] = attribs.rightmargin;
            PAGE_SETUP_JSON[0]['topMargin'] = attribs.topmargin;
            PAGE_SETUP_JSON[0]['bottomMargin'] = attribs.bottommargin;
          }

          // for the open tag for the <pageheader> <columnheader>, <detail>  and <pagefooter> 
          // we will do flag true when root node open on below tag type given in condition
          // this index value is represent the page setup json index ,where specific setting will be saved.
          if (name === 'pageheader' || name === 'columnheader' || name === 'detail' || name === 'pagefooter') {
            flag = true;
            index = index + 1;
          }

          // for store the band height when root node will be open
          // here is two conditon =>
          // the page header, footer and coloumn hader contain only one band at a time.
          // detail section contain more than one band at at time for multiple data.
          if (name === 'band' && flag && index !== 3) {
            PAGE_SETUP_JSON[index]['band_height'] = attribs.height;
          } else if (name === 'band' && flag && index === 3) {
            PAGE_SETUP_JSON[index].band.push({
              'band_height': attribs.height,
              'textField': [],
            })
          }

          // for store the report element height ,width ,x asix and y asix when band will be open
          if (name === 'reportelement' && flag && index !== 2 && index !== 3) {
            PAGE_SETUP_JSON[index]['report_element']['height'] = attribs.height;
            PAGE_SETUP_JSON[index]['report_element']['width'] = attribs.width;
            PAGE_SETUP_JSON[index]['report_element']['x'] = attribs.x;
            PAGE_SETUP_JSON[index]['report_element']['y'] = attribs.y;
          } else if (name === 'reportelement' && flag && index === 2) {

            PAGE_SETUP_JSON[index]['textField'].push({
              height: attribs.height,
              width: attribs.width,
              x: attribs.x,
              y: attribs.y,
              text: '',
            })

          } else if (name === 'reportelement' && flag && index === 3) {

            let bandIndex = PAGE_SETUP_JSON[index]['band'].length - 1;

            PAGE_SETUP_JSON[index]['band'][bandIndex]['textField'].push({
              height: attribs.height,
              width: attribs.width,
              x: attribs.x,
              y: attribs.y,
              text: '',
            })

          }

        },

        ontext: (text) => {

          // for store the text
          if (flag && tag_type === 'text' && index !== 2 && index !== 3) {
            PAGE_SETUP_JSON[index]['text'] = text;
            tag_type = '';
          } else if (flag && tag_type === 'textfieldexpression' && index === 2) {

            PAGE_SETUP_JSON[index]['textField'][PAGE_SETUP_JSON[index]['textField'].length - 1]['text'] = text;

            tag_type = '';
          } else if (flag && tag_type === 'textfieldexpression' && index === 3) {

            let bandIndex = PAGE_SETUP_JSON[index]['band'].length - 1;

            let textFieldIndex = PAGE_SETUP_JSON[index]['band'][bandIndex]['textField'].length - 1;

            PAGE_SETUP_JSON[index]['band'][bandIndex]['textField'][textFieldIndex].text = text;

            tag_type = '';
          }

        },

        onclosetag: (name) => {

          // when root node will be close, then flag will be falsed. 
          if (name === 'pageheader' || name === 'columnheader' || name === 'detail' || name === 'pagefooter') {

            flag = false;

          }

        },

      },

        {

          decodeEntities: true,

        });

      parser.write(jrxml);

      parser.end();

    })

  }

}
