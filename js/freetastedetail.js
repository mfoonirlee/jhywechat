require(['vue', 'Zepto', 'Loading', 'Req', 'Util'], function (Vue, $, Loading, Req, Util) {
    var farmVue = new Vue({
        el: '#j_main',
        data: function(){
            return {
                msg: '我要试吃',
                data: {},
                num: 1,
                name: '',
                tel: '',
                addr: ''
            }
        },
        created: function(){
            this.changeType(Util.getQueryParam('type'));
            Loading.showLoading();
            Req.execute('freeShareDetail', 'aid=' + Util.getQueryParam('aid'), function(data){
                Loading.hideLoading();
                this.data = data;
            }, function(data){
                Loading.hideLoading();
                setTimeout(function () {
                    history.back(-1);
                }, 2000);
            }, this);
        },
        methods: {
            changeType: function (type) {
                this.type = type;
                if(this.type == '1'){
                    $('#j_tab1').show();
                    $('#j_tab2').hide();
                    this.msg = '我要试吃';
                }else{
                    $('#j_tab1').hide();
                    $('#j_tab2').show();
                    this.msg = '确认';
                }
            },
            jump: function(e){
                var $target = $(e.currentTarget),
                    href = $target.data('href');

                location.href = href;
            },
            add: function(){
                this.num++;
            },
            reduce: function () {
                if(this.num > 1){
                    this.num--;
                }
            },
            validateParam: function () {
                if(!this.name){
                    alert('请输入姓名');
                    return false;
                }
                if(!this.tel || !/^1[345678][\d]{9}$/g.test(this.tel)){
                    alert('请输入正确的手机号');
                    return false;
                }
                if(!this.addr){
                    alert('请输入地址');
                    return false;
                }

                return true;
            },
            bookByType: function () {
                if(this.type == '1'){
                    this.changeType(2);
                }else{
                    if(this.validateParam()){
                        Loading.showLoading();
                        var paramStr = 'aid=' + Util.getQueryParam('aid') + '&address=' + this.addr + '&number=' + this.num + '&mobile=' + this.tel + '&name=' + this.name;
                        Req.execute('booking', paramStr, function (data) {
                            Loading.hideLoading();
                            if(data.IsSuccess == '1'){
                                alert('报名成功!');
                            }else{
                                alert(data.msg);
                                location.href = data.url;
                            }
                        }, function () {
                            Loading.hideLoading();
                            alert('服务出错，请重试');
                        }, this);
                    }
                }
            },
            returnByType: function(){
                if(this.type == '1'){
                    history.back(-1);
                }else{
                    this.changeType(1);
                }
            }
        }
    });

});