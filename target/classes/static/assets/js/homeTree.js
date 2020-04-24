


// function b(callBack){
//       alert(callBack);
// }


function load_jsmind(data) {
    if(!data || data.length==0) {
        return;
    }

    var mind = {
        meta: {
            name: 'demo',
            author: 'hizzgdev@163.com',
            version: '0.2'
        },
        format: 'node_array',
        data: data
    };
    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: '',
        support_html: true,
        shortcut: {
            handles: {
                test: function (j, e) {
                    console.log(j);
                }
            },
            mapping: {
                test: 89
            }
        },
        view: {
            engine: 'svg',   // 思维导图各节点之间线条的绘制引擎
            hmargin: 100,        // 思维导图距容器外框的最小水平距离
            vmargin: 50,         // 思维导图距容器外框的最小垂直距离
            line_width: 1,       // 思维导图线条的粗细
            line_color: '#111'   // 思维导图线条的颜色
        }
    }
    _jm = jsMind.show(options, mind);






    $("#jsmind_container").find("jmnode").on("click", function () {
        memberId = $(this).attr("nodeid");
        // 点击节点的成员信息
        var self ={};
        var father = {};
        var monther = [];
        var brother = [];
        var childs = [];
        var wife = [];

        // 搜索找到自己对应节点和自己孩子节点和自己妻子节点
        for(var i=0;i<sourceData.length;i++) {
            if(sourceData[i].memberId==memberId) {
                self = sourceData[i];

            } else if(sourceData[i].parentMemberId == memberId) {
                childs.push(sourceData[i]);
            } else if(sourceData[i].mateId == memberId) {
                wife.push(sourceData[i]);
            }
        }
        // 如果存在父亲，找到父亲节点
        if(self.parentMemberId) {
            for(var i=0;i<sourceData.length;i++) {
                if(sourceData[i].memberId==self.parentMemberId) {
                    father=sourceData[i];
                    break;
                }
            }
            // 找到父亲后再找母亲节点和兄弟节点
            for(var i=0;i<sourceData.length;i++) {
                if(sourceData[i].mateId==father.memberId) {
                    monther.push(sourceData[i]);
                } else if(sourceData[i].parentMemberId==father.memberId && sourceData[i]!=self) {
                    brother.push(sourceData[i]);
                }
            }
        }
        // 开始填充数据
        $('#cloneiosDialog1').remove();
        var _iosDialog1 = $('#iosDialog1').clone();
        //附上自己的id，查看详情
        _iosDialog1.find('.people-edit .details').attr('data-id',memberId);
        _iosDialog1.find('.people-edit .delete').attr('data-id',memberId);
        _iosDialog1.find('.weui-half-screen-dialog__title').html(self.userName);
        _iosDialog1.attr("id","cloneiosDialog1");
        // 填充父亲
        var _dialog1 = _iosDialog1.find('li');
        var dialog1Element = $(_dialog1[0]);


        var father_html = dialog1Element.find('.XY');
        if(JSON.stringify(father)!=="{}") {
            father_html.find('.details').attr("data-id",father.memberId);
            father_html.find('.name').html(father.userName);
        } else {
            father_html.find('.add').show();
            father_html.find('.one').hide();
        }
        //填充母亲
        if(monther) {
            var monther_html = dialog1Element.find('.XX');

            for(var i=0;i<monther.length;i++) {
                var _clone = monther_html.clone();
                $(_clone).find('.name').html(monther[i].userName);
                // console.log( $(_clone).find('.name').html())
                $(_clone).attr("data-id",monther[i].memberId);
                $(_clone).show();
                dialog1Element.find('.list').children('.add').before(_clone);
            }
        }
        if(brother) {
            dialog1Element = $(_dialog1[1]);
            var brother_html = dialog1Element.find('.XY');
            var sister_html=dialog1Element.find('.XX');
            for(var i=0;i<brother.length;i++) {
                var _clone;
                if(brother[i].genderId ==0) {
                    _clone = brother_html.clone();
                } else {
                    _clone = sister_html.clone();
                }
                $(_clone).find('.name').html(brother[i].userName);
                $(_clone).attr("data-id",brother[i].memberId);
                $(_clone).show();
                dialog1Element.find('.list').children('.add').before(_clone);
            }
        }

        if(wife) {
            dialog1Element = $(_dialog1[2]);
            var wife_html = dialog1Element.find('.XX');
            for(var i=0;i<wife.length;i++) {
                var _clone= wife_html.clone();
                $(_clone).find('.name').html(wife[i].userName);
                $(_clone).attr("data-id",wife[i].memberId);
                $(_clone).show();
                dialog1Element.find('.list').children('.add').before(_clone);
            }
        }
        if(childs) {
            dialog1Element = $(_dialog1[3]);
            var man_html = dialog1Element.find('.XY');
            var woman_html=dialog1Element.find('.XX');
            for(var i=0;i<childs.length;i++) {
                var _clone;
                if(childs[i].genderId ==0) {
                    _clone = man_html.clone();
                } else {
                    _clone = woman_html.clone();
                }
                $(_clone).find('.name').html(childs[i].userName);
                $(_clone).attr("data-id",childs[i].memberId);
                $(_clone).show();
                dialog1Element.find('.list').children('.add').before(_clone);
            }
        }
        $('#dialogs').append(_iosDialog1);
        _iosDialog1.fadeIn(200);
        _iosDialog1.find('.weui-half-screen-dialog').addClass('weui-half-screen-dialog_show');
        // 需要重新绑定一下事件，因为新加的元素节点不会继承原来绑定的事件
        $(".weui-icon-close-thin").on('click', function () {
            $('#cloneiosDialog1').fadeOut(200);
            $('#cloneiosDialog1').find('.weui-half-screen-dialog').removeClass('weui-half-screen-dialog_show');
        });

        //点击成员
        $(".details").on('click', function () {
            var clickUser = this.dataset.id;
            console.log(familyBranchId)
            var someId = {}
            someId['familyBranchId']=familyBranchId
            // 编辑成员的id
            someId['memberId']=clickUser;
            someId['mmemberId']=self.memberId;
            if(isAdmin || isSuperAdmin ||checkPermission(clickUser,store_tree)) {
                someId['canEdit']=true;
            } else {
                someId['canEdit']=false;
            }

            window.sessionStorage.setItem('someId',JSON.stringify(someId));
            window.location.hash = 'form'
            // window.location.href = 'my?memberId='+ clickUser + '&familyBranchId='+ familyBranchId + '#form'
        });

        $('.delete').on('click',function () {
            var clickUser = this.dataset.id;
            console.log(clickUser);
            if (!(isAdmin || isSuperAdmin || checkPermission(clickUser,store_tree))) {
                $('#txtToast').fadeIn(100);
                $('#txtToast').find('.weui-toast__content').html('无操作权限');
                setTimeout(function(){ $('#txtToast').fadeOut(100) }, 1000);
                return;
            }
            var loading = weui.loading('加载中...');
            ajaxPost({
                type: "POST",
                url: "/member/deleteMember",
                data:{memberId:clickUser,familyBranchId:familyBranchId},
                success: function (data) {
                    if (data.statusCode == 200) {
                        var jsMindData = [];
                        ajaxPost(
                            {
                                type: "GET",
                                url: "member/getMembersByFamilyBranchId",
                                data:{familyBranchId:familyBranchId},
                                success: function (data) {
                                    if (data.statusCode == 200) {
                                        sourceData = data.data
                                        jsMindData = formatData(sourceData);
                                        $('#jsmind_container').empty()
                                        load_jsmind(jsMindData);
                                        $('#cloneiosDialog1').css({
                                            "opacity": "0",
                                            "display": "none"
                                        });
                                        window.sessionStorage.removeItem('someId');
                                    } else {
                                        weui.topTips(data.message, 3000);
                                    }
                                }
                            });
                        loading.hide();
                    } else {
                        loading.hide();
                        $('#txtToast').fadeIn(100);
                        $('#txtToast').find('.weui-toast__content').html(data.message);
                        setTimeout(function(){ $('#txtToast').fadeOut(100) }, 1000);
                    }
                }
            });
        });

        //点击添加
        $(".add.addEdit").on('click', function () {
            if (isAdmin || isSuperAdmin || checkPermission(self.memberId,store_tree,this.dataset.relation)) {
                console.log('可以添加')
                //弹窗的用户的信息
                console.log(self)
                var someId = {}
                someId['relation']=this.dataset.relation
                someId['memberId']=self.memberId
                someId['familyBranchId']=self.familyBranchId
                someId['familyId']=self.familyId
                someId['familyBasicId']=self.familyBasicId
                someId['parentMemberId']=self.parentMemberId
                someId['mateId']=self.mateId

                window.sessionStorage.setItem('someId',JSON.stringify(someId));
                window.location.hash = 'form'

                // window.location.href = 'home?relation='+ this.dataset.relation +'&memberId='+ self.memberId + '&familyBranchId='+ self.familyBranchId + '&familyId='+self.familyId+'&familyBasicId='+self.familyBasicId+'&parentMemberId ='+self.parentMemberId+'&mateId='+self.mateId+'#form'
            }else {
                $('#txtToast').fadeIn(100);
                $('#txtToast').find('.weui-toast__content').html('无操作权限');
                setTimeout(function(){ $('#txtToast').fadeOut(100) }, 1000);
            }

        });
    });


    $("#zoomOut").on("click", function () {
        console.log("缩小")
        _jm.view.zoomOut();
    });
    $("#zoomIn").on("click", function () {
        console.log("放大");
        _jm.view.zoomIn();
    });
    _jm.get_node(6)
    _jm.select_node(6)
}

function formatData(data) {
    if (!data || data.length == 0) {
        return data;
    }
    var _data = [];
    var _mateData = [];
    for (var i = 0; i < data.length; i++) {
        var _d = data[i];
        var _line = {};
        var _lineMate = {};
        if (isNullOrEmpty(_d.mateId) || _d.mateId == 0) {
            _line.id = _d.memberId;
            if (isNullOrEmpty(_d.parentMemberId)) {
                _line.isroot = true;
                // _line.topic = _d.userName;
                _line.topic = "<div class='node'>";
                _line.topic += "<div class='block' id='" + _d.memberId + "'><div class='image'><img src='" + _d.headThumb + "' onerror='javascript:this.src=\"images/icon_nav_user.png\";'/></div><div class='text";
                if (_d.genderId == 1) {
                    _line.topic += " female"
                }
                if (_d.isDead == 1) {
                    _line.topic += " dead"
                }
                _line.topic += "'>" + _d.userName + "</div></div>";
                _line.topic += "</div>";

                _data.push(_line);
            } else {
                _line.parentid = _d.parentMemberId;
                _line.topic = "<div class='node'>";
                _line.topic += "<div class='block' id='" + _d.memberId + "'><div class='image'><img src='" + _d.headThumb + "' onerror='javascript:this.src=\"images/icon_nav_user.png\";'/></div><div class='text";
                if (_d.genderId == 1) {
                    _line.topic += " female"
                }
                if (_d.isDead == 1) {
                    _line.topic += " dead"
                }
                _line.topic += "'>" + _d.userName + "</div></div>";
                _line.topic += "</div>";
                _data.push(_line);
            }
        } else {
            _lineMate.mateId = _d.mateId;
            _lineMate.topic = "<div class='block' id='" + _d.memberId + "'><div class='image'><img src='" + _d.headThumb + "' onerror='javascript:this.src=\"images/icon_nav_user.png\";'/></div><div class='text";
            if (_d.genderId == 1) {
                _lineMate.topic += " female"
            }
            if (_d.isDead == 1) {
                _lineMate.topic += " dead"
            }
            _lineMate.topic += "'>" + _d.userName + "</div></div>";
            _mateData.push(_lineMate);
        }
    }
    //如果存在配偶，则将其加入到主配偶的块中，并将主配偶的node宽度增加，多一位多23px
    if (_mateData.length > 0) {
        console.log('h')
        var aa = []
        var bb = 0
        _mateData.forEach(function(e){
            _data.forEach(function (ee) {
                if (ee.id == e.mateId) { //TODO:多个配偶要改变长度
                    aa.push(ee.id)
                }
            })
        })
        var obj = {};
        for(var aaa= 0;aaa <  aa.length; aaa++){
            var item = aa[aaa];
            obj[item] = (obj[item] +1 ) || 1;
        }



        // var objData = JSON.parse(obj.replace("{","").replace("}","").replace(/:/g, '","'));

        //obj转数组了
        var objData = JSON.stringify(obj).replace("{","").replace("}","").replace(/:/g, ',').replace(/"/g, '')
        var objDataArr = objData.split(",")
        console.log(objDataArr)

        for (var i = 0; i < _mateData.length; i++) {
            for (var j = 0; j < _data.length; j++) {
                var _topicStart;
                var _topicEnd;
                // console.log(i,j)
                if (_data[j].id == _mateData[i].mateId) {//TODO:多个配偶要改变长度
                    console.log(_data[j].id,_mateData[i].mateId)
                    objDataArr.forEach(function (e,index) {
                            if(_data[j].id == e){
                                var idx = index+1

                                var _widthJ =23* objDataArr[idx] + 23
                                console.log(objDataArr[idx])
                                _topicStart = _data[j].topic.substring(0, 17) + " style='width:"+ _widthJ +"px' " + _data[j].topic.substring(17, _data[j].topic.length - 6);
                                //_topicStart=_data[j].topic.substring(0,_data[j].topic.length-6);
                                _topicEnd = _mateData[i].topic + "</div>";
                                _data[j].topic = _topicStart + _topicEnd;
                            }
                        }

                    )


                }
            }
        }
    }
    return _data;
}
function searchMember(data) {
    console.log(data)
    $('#searchResult').empty()
    $('#searchResult').html(
        '<div class="weui-cell weui-cell_active weui-cell_access">\n' +
        '                    <div class="weui-cell__bd weui-cell_primary">\n' +
        '                        <p>关键词搜索结果</p>\n' +
        '                    </div>\n' +
        '                </div>')
    if(data.length == 0){
        $(".SearchBar .weui-cells ").append('<div class="weui-cells__title">无该成员</div>')
    }else {
        $searchResultCell = $('.SearchBar .weui-cells .weui-cell');
        data.forEach(function (e) {
            console.log(e)
            var $cloneData = $searchResultCell.clone().css("pointer-events","auto")
            var gendername=e.genderId ==0 ?"男":"女"
            $cloneData.attr('data-id',e.memberId).find("p").html(e.userName +'<span class="right">'+gendername +'</span>')
            $(".SearchBar .weui-cells ").append($cloneData)
        })
        //点击事件
        $('.SearchBar .weui-cells .weui-cell').on('click',function () {
            var clickUser = this.dataset.id;
            console.log(familyBranchId)
            var someId = {}
            //族谱的id
            someId['familyBranchId']=familyBranchId
            // 编辑成员的id
            someId['memberId']=clickUser;
            //登录的id
            // someId['mmemberId']=self.memberId;
            window.sessionStorage.setItem('someId',JSON.stringify(someId));
            window.location.hash = 'form'
        })
    }
}
function extraName(e) {
    $('#extra-name').text(e)
}

// 权限检查
function checkPermission(edit_memberId,store_tree,relation) {
    // 检查被编辑人是否是当前操作人的(父，母，爷，奶，太爷，太奶，自己，兄弟，儿子，儿媳，孙子，孙媳，曾孙，曾媳)
    // 检查添加的成员与本人的关系（媳妇，兄嫂，母，奶，太奶，儿及媳，孙及媳，曾孙及媳）
    // 有relation表示不是编辑而是新增
    var me_node=store_tree.me_node;
    var node;
    // 检查自己
    if(me_node.body.memberId == edit_memberId) {
        return true;
    }
    // 检查父 母
    if(!isNullOrEmpty(me_node.parentNode)) {
        node = me_node.parentNode;
        if(checkNodePermission(edit_memberId,node)) {
            if(!isNullOrEmpty(relation)) {
                // 添加父的母亲，父的妻子，父的儿子
                if("mather" === relation || "wife" === relation || "child" === relation) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        }
        // 检查爷 奶
        if(!isNullOrEmpty(node.parentNode)) {
            node = node.parentNode;
            if(checkNodePermission(edit_memberId,node)) {
                if(!isNullOrEmpty(relation)) {
                    // 添加爷的母亲，爷的妻子
                    if("mather" === relation || "wife" === relation) {
                        return true;
                    }
                    return false;
                } else {
                    return true;
                }
            }
            // 检查太爷太奶
            if(!isNullOrEmpty(node.parentNode)) {
                node = node.parentNode;
                if(checkNodePermission(edit_memberId,node)) {
                    if(!isNullOrEmpty(relation)) {
                        // 添加太爷的妻子
                        if("wife" === relation) {
                            return true;
                        }
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    }
    // 检查兄弟
    if(!isNullOrEmpty(me_node.parentNode)) {
        node = me_node.parentNode;
        if(!isNullOrEmpty(node.childrens)) {
            for(var i=0;i<node.childrens.length;i++) {
                if(checkNodePermission(edit_memberId,node.childrens[i])) {
                    if(!isNullOrEmpty(relation)) {
                        // 添加兄弟的母亲，兄弟的妻子，兄弟的同胞
                        if("mather" === relation || "wife" === relation || "brother" === relation) {
                            return true;
                        }
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    }
    // 检查儿子们
    if(!isNullOrEmpty(me_node.childrens)) {
        node = me_node;
        for(var i=0;i<node.childrens.length;i++) {
            if(checkNodePermission(edit_memberId,node.childrens[i])) {
                return true;
            }
            // 检查孙子
            if(!isNullOrEmpty(node.childrens[i].childrens)) {
                for(var j=0;j<node.childrens[i].childrens.length;j++) {
                    if(checkNodePermission(edit_memberId,node.childrens[i].childrens[j])) {
                        return true;
                    }
                    // 检查曾孙
                    if(!isNullOrEmpty(node.childrens[i].childrens[j].childrens)) {
                        for(var k=0;k<node.childrens[i].childrens[j].childrens.length;k++) {
                            if(checkNodePermission(edit_memberId,node.childrens[i].childrens[j].childrens[k])) {
                                if(!isNullOrEmpty(relation)) {
                                    // 添加曾孙的母亲，曾孙的妻子，曾孙的同胞
                                    if("mather" === relation || "wife" === relation || "brother" === relation) {
                                        return true;
                                    }
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
// 检查节点编辑权限
function checkNodePermission(edit_memberId,node) {
    // 检查节点本身memberId是否相等
    if(node.body.memberId == edit_memberId) {
        return true;
    }
    // 检查节点妻子memberId是否相等
    if(!isNullOrEmpty(node.wife)) {
        for(var i=0;i<node.wife.length;i++) {
            if(node.wife[i].memberId == edit_memberId) {
                return true;
            }
        }
    }
    return false;
}
// 根据数据初始化树形结构
function initTreeData(data,store_tree) {
    // 建立父id map
    var parentMemberIdMap=new Map();
    // 建立丈夫id map
    var mateIdMap=new Map();
    var arr;
    // 判断当前登陆人是否是妻子身份
    for(var i=0;i<data.length;i++) {
        if(store_tree.memberId === data[i].memberId) {
            if(!isNullOrEmpty(data[i].mateId)) {
                // 当前登陆人为某人妻子，应该具有某人的相同权限
                store_tree.memberId=data[i].mateId;
            }
            break;
        }
    }
    data.forEach(function (e) {
        if(!isNullOrEmpty(e.parentMemberId)) {
            arr=parentMemberIdMap.get(e.parentMemberId);
            if(isNullOrEmpty(arr)) {
                arr=[];
                parentMemberIdMap.set(e.parentMemberId,arr);
            }
            arr.push(e);
        }
        if(!isNullOrEmpty(e.mateId)) {
            arr=mateIdMap.get(e.mateId);
            if(isNullOrEmpty(arr)) {
                arr=[];
                mateIdMap.set(e.mateId,arr);
            }
            arr.push(e);
        }
    });
    var tree={};
    for(var i=0;i<data.length;i++) {
        if(isNullOrEmpty(data[i].parentMemberId) && isNullOrEmpty(data[i].mateId)) {
            tree.body=data[i];
            break;
        }
    }
    initTreeData_deepSearch(tree,parentMemberIdMap,mateIdMap,store_tree);
    store_tree.tree=tree;
    return store_tree;
}
// 递归建树
function initTreeData_deepSearch(tree,parentMemberIdMap,mateIdMap,store_tree) {
    if(tree.body.memberId === store_tree.memberId) {
        store_tree.me_node=tree;
    }
    var childrens=[];
    var wife=[];
    var arr=parentMemberIdMap.get(tree.body.memberId);
    if(!isNullOrEmpty(arr)) {
        arr.forEach(function (e) {
            childrens.push({
                body:e,
                parentNode:tree
            })
        })
    }
    tree.childrens=childrens;
    arr=mateIdMap.get(tree.body.memberId);
    if(!isNullOrEmpty(arr)) {
        arr.forEach(function (e) {
            wife.push({
                body:e
            })
        })
    }
    tree.wife=wife;
    if(childrens.length>0) {
        childrens.forEach(function (e) {
            initTreeData_deepSearch(e,parentMemberIdMap,mateIdMap,store_tree);
        });
    }
}
