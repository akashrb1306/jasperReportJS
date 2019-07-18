export let PAGE_SETUP_JSON = [

    // <!--*** PAGE SETUP GOES HERE ***-->
    {
        'parameter_name': 'page_type',
        'pageHeight': '',
        'pageWidth': '',
        'columnWidth': '',
        'leftMargin': '',
        'rightMargin': '',
        'topMargin': '',
        'bottomMargin': '',
    },

    // <!--*** PAGE HEADER SETUP GOES HERE ***-->
    {
        'parameter_name': 'page_header',
        'band_height': '',
        'report_element': {
            'x': '',
            'y': '',
            'width': '',
            'height': '',
        },
        'text': '',
    },

    // <!--*** COLOUMN HEADER  SETUP GOES HERE ***-->
    {
        'parameter_name': 'coloumn_header',
        'band_height': '',
        'textField': [],
    },

    // <!--*** DETAIL SECTION SETUP GOES HERE ***-->
    // BAND FIELD CONTTAIN BAND HEIGHT AND REPORT ELEMENT AND TEXT
    {
        'parameter_name': 'detail',
        'band': []
    },

    // <!--*** PAGE FOOTER GOES HERE ***-->
    {
        'parameter_name': 'page_footer',
        'band_height': '',
        'report_element': {
            'x': '',
            'y': '',
            'width': '',
            'hieght': '',
        },
        'text': '',
    },

];
