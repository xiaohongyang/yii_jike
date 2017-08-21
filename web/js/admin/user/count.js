

$(function(){

    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    app.title = '注册用户统计';



    var setOption = function(){
        $.ajax({
            url : $.fn.apihost + '/api/user/registerChartList',
            data : {},
            method : 'post',
            dataType : 'json',
            success : function(json){


                var monthArr = []
                var accountArr = []
                if(json.status==1 && json.data.length>0){
                    for(i=0; i< json.data.length; i++){
                        monthArr.push( json.data[i].year + json.data[i].month )
                        accountArr.push( json.data[i].count )
                    }
                }

                var option = getOption(monthArr, accountArr);
                myChart.setOption(option, true);
            }
        })
    }

    var getOption = function(monthArr, accountArr){
        option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : monthArr,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'注册人数',
                    type:'bar',
                    barWidth: '60%',
                    data: accountArr
                }
            ]
        };

        return option;
    }

    setOption();

})