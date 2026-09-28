// Functions.

function _build_author_div(author_list) {
    var author = document.createElement('div');
    author.setAttribute('class', 'author');
    author.innerHTML = '';
    for (var idx = 0; idx < author_list.length; idx++) {
        if (idx < author_list.length - 1 &&
            (author_list[idx + 1] == 'equal' ||
             author_list[idx + 1] == 'corresponding')) {
            author.innerHTML += (
                '<span name="' +
                author_list[idx] +
                '" title="' +
                author_list[idx + 1] +
                '"></span>');
            idx++
        } else {
            author.innerHTML += (
                '<span name="' +
                author_list[idx] +
                '" title="' +
                '"></span>');
        }
        if (idx < author_list.length - 1) {
            author.innerHTML += ', ';
        }
    }
    return author;
}

function _build_venue_and_material(material_list, award_name) {
    // Extract venue from first material item (if it looks like a venue)
    var venue_name = null;
    var paper_url = null;
    var links_start_idx = 0;

    if (material_list && material_list.length > 0) {
        var first_item = material_list[0][0];
        var venue_patterns = ['CVPR', 'ICCV', 'ECCV', 'NeurIPS', 'ICML', 'ICLR', 'SIGGRAPH', 'CoRL', '3DV', 'TPAMI', 'arXiv', 'arxiv', 'CVPRW', 'AAAI', 'RSS'];
        var is_venue = venue_patterns.some(function(pattern) {
            return first_item.indexOf(pattern) !== -1;
        });

        if (is_venue) {
            venue_name = first_item;
            paper_url = material_list[0][1];
            links_start_idx = 1;
        }
    }

    var venue_line = document.createElement('div');
    venue_line.setAttribute('class', 'venue-line');

    if (award_name && award_name !== '') {
        venue_line.innerHTML = '<span class="award">' + award_name + '</span>';
        if (venue_name) {
            venue_line.innerHTML += ' · ';
        }
    }

    if (venue_name) {
        var venue_parts = venue_name.match(/^([A-Za-z\s]+)(.*)$/);
        if (venue_parts) {
            venue_line.innerHTML += '<span class="venue"><b>' + venue_parts[1].trim() + '</b> ' + venue_parts[2] + '</span>';
        } else {
            venue_line.innerHTML += '<span class="venue">' + venue_name + '</span>';
        }
    }

    var material = document.createElement('div');
    material.setAttribute('class', 'material');

    if (paper_url && paper_url !== '') {
        material.innerHTML += '<a href="' + paper_url + '" target="_blank">Paper</a>';
    }

    for (var idx = links_start_idx; material_list && idx < material_list.length; idx++) {
        if (material.innerHTML !== '') {
            material.innerHTML += ' ';
        }
        material.innerHTML += (
            '<a href="' +
            material_list[idx][1] +
            '" target="_blank">' +
            material_list[idx][0] +
            '</a>');
    }

    return { venueEl: venue_line, materialEl: material };
}

function _build_version(author_list, material_list, award_name) {
    var authorEl = _build_author_div(author_list);
    var vm = _build_venue_and_material(material_list, award_name);
    return { authorEl: authorEl, venueEl: vm.venueEl, materialEl: vm.materialEl };
}

function render_project(project_name,
                        figure_path,
                        title_name,
                        author_list,
                        material_list,
                        award_name=null,
                        conference_author_list=null,
                        conference_material_list=null,
                        primary_label='arXiv version',
                        conference_label='Conference version') {
    // Use querySelectorAll for better compatibility with dynamic content
    var rows = document.querySelectorAll('#pubs [name="' + project_name + '"]');
    if (rows.length === 0) {
        return;
    }

    var has_conference = conference_author_list != null;

    // Render ALL occurrences of this project (for multiple views)
    for (var rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        var row = rows[rowIdx];

        // Skip if already rendered (check for child elements)
        if (row.children && row.children.length > 0) {
            continue;
        }

        var media;
        if (figure_path.endsWith('.mp4') || figure_path.endsWith('.webm')) {
            media = document.createElement('video');
            media.src = figure_path;
            media.muted = true;
            media.autoplay = true;
            media.loop = true;
            media.playsInline = true;
        } else {
            media = document.createElement('img');
            media.src = figure_path;
        }

        var title = document.createElement('div');
        title.setAttribute('class', 'title');
        title.innerHTML = title_name;

        var primary = _build_version(author_list, material_list, award_name);

        // Use createElement instead of insertCell for better compatibility
        var cell1 = document.createElement('td');
        cell1.setAttribute('width', '25%');
        cell1.appendChild(media);
        row.appendChild(cell1);

        var cell2 = document.createElement('td');
        cell2.appendChild(title);

        if (!has_conference) {
            cell2.appendChild(primary.authorEl);
            cell2.appendChild(primary.venueEl);
            cell2.appendChild(primary.materialEl);
        } else {
            // Conference version excludes award (award only meaningful post-acceptance)
            var conference = _build_version(conference_author_list, conference_material_list, null);

            var primaryWrap = document.createElement('div');
            primaryWrap.setAttribute('class', 'pub-version pub-version-primary');
            primaryWrap.appendChild(primary.authorEl);
            primaryWrap.appendChild(primary.venueEl);
            primaryWrap.appendChild(primary.materialEl);

            var confWrap = document.createElement('div');
            confWrap.setAttribute('class', 'pub-version pub-version-conference');
            confWrap.hidden = true;
            confWrap.appendChild(conference.authorEl);
            confWrap.appendChild(conference.venueEl);
            confWrap.appendChild(conference.materialEl);

            var toggle = document.createElement('div');
            toggle.setAttribute('class', 'version-toggle');
            var primaryTab = document.createElement('a');
            primaryTab.setAttribute('class', 'version-tab is-active');
            primaryTab.textContent = primary_label;
            var confTab = document.createElement('a');
            confTab.setAttribute('class', 'version-tab');
            confTab.textContent = conference_label;

            (function(pWrap, cWrap, pTab, cTab) {
                pTab.addEventListener('click', function(e) {
                    e.preventDefault();
                    pWrap.hidden = false;
                    cWrap.hidden = true;
                    pTab.classList.add('is-active');
                    cTab.classList.remove('is-active');
                });
                cTab.addEventListener('click', function(e) {
                    e.preventDefault();
                    pWrap.hidden = true;
                    cWrap.hidden = false;
                    cTab.classList.add('is-active');
                    pTab.classList.remove('is-active');
                });
            })(primaryWrap, confWrap, primaryTab, confTab);

            toggle.appendChild(primaryTab);
            toggle.appendChild(confTab);

            cell2.appendChild(toggle);
            cell2.appendChild(primaryWrap);
            cell2.appendChild(confWrap);
        }

        row.appendChild(cell2);
    }
};

function render_author(author_name, link=null, alias=null) {
    // Use querySelectorAll for better compatibility with dynamic content
    var list = document.querySelectorAll('#pubs [name="' + author_name + '"]');
    for (var idx = 0; idx < list.length; idx++) {
        var contribution = list[idx].title;
        var tailing = '';
        if (contribution === 'equal') {
            tailing = '*';
        } else if (contribution === 'corresponding') {
            tailing = '<sup>+<sup>';
        }

        var context = ''
        if (alias) {
            context = alias + tailing;
        } else {
            context = author_name + tailing;
        }

        if (link != null ){
            list[idx].innerHTML = (
                '<a href="' +
                link +
                '" target="_blank">' +
                context +
                '</a>');
        } else {
            list[idx].innerHTML = context;
        }

        if (author_name === 'Yinghao Xu') {
            list[idx].setAttribute('class', 'me')
        }
    }
};










// Template.

render_project(
    project_name='template',
    figure_path='./assets/projects/',
    title_name='',
    author_list=[
        '',
    ],
     material_list=[
        ['Paper', ''],
        ['Project', ''],
        ['Code', ''],
        ['Demo', ''],
    ],
    award_name=null,
);


// Projects.

render_project(
    project_name='DSAQuant',
    figure_path='./assets/projects/dsaquant.jpg',
    title_name='DSAQuant: Denoising-Stage-Aligned Quantization-Aware Training for Video Generation',
    author_list=[
        'Shuaiting Li',
        'Zelin Gao',
        'Haibin Shen',
        'Yujun Shen',
        'Haotong Qin',
        'Yinghao Xu',
    ],
    material_list=[
        ['NeurIPS 2026', 'https://arxiv.org/abs/2609.04031'],
        ['Project Page', 'https://robbyant-research.github.io/DSAQuant/'],
        ['Code', 'https://github.com/robbyant-research/DSAQuant'],
        ['Model', 'https://huggingface.co/Robbyant-Research/DSAQuant'],
    ],
    award_name=null,
);

render_project(
    project_name='ZeroWAM',
    figure_path='./assets/projects/zero-wam.mp4',
    title_name='Zero-WAM: In-Context World-Action Modeling from Human Videos for Open-Ended Task Generalization',
    author_list=[
        'Jiaming Zhou',
        'Qihang Zhang',
        'Gangwei Xu',
        'Cunxin Fan',
        'Yujie Zhao',
        'Ruilin Wang',
        'Yiming Luo',
        'Shuai Yang',
        'Xing Zhu',
        'Yujun Shen',
        'Junwei Liang',
        'Yinghao Xu',
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2608.26103'],
        ['Project Page', 'https://robbyant-research.github.io/Zero-WAM/'],
        ['Code', 'https://github.com/robbyant-research/Zero-WAM'],
    ],
    award_name=null,
);

render_project(
    project_name='4DAnyone',
    figure_path='./assets/projects/4danyone.mp4',
    title_name='4DAnyone: Create Anyone in 4D from a Casual Monocular Video',
    author_list=[
        'Yudong Jin',
        'Tao Xie',
        'Qihang Zhang',
        'Zehong Shen',
        'Zhen Xu',
        'Yujun Shen',
        'Hujun Bao',
        'Xiaowei Zhou',
        'Yinghao Xu',
    ],
    material_list=[
        ['SIGGRAPH ASIA 2026', 'https://arxiv.org/abs/2608.20335'],
        ['Project Page', 'https://4danyone.github.io/'],
        ['Code', 'https://github.com/ant-research/4DAnyone'],
        ['Model', 'https://huggingface.co/AntResearch/4DAnyone'],
    ],
    award_name=null,
);

render_project(
    project_name='ThinkWithTools',
    figure_path='./assets/projects/thinking-with-tools.jpg',
    title_name='Thinking With Tools, Not With Pixels: Tool Calls as Text Scaffolds for Visual Reasoning',
    author_list=[
        'Jiahao Shao',
        'Yuanbo Yang',
        'Yiyi Liao',
        'Yujun Shen',
        'Ceyuan Yang',
        'Yinghao Xu',
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2608.09682'],
        ['Project Page', 'https://textcall.github.io/'],
    ],
    award_name=null,
);

render_project(
    project_name='Image2Sim',
    figure_path='./assets/projects/image2sim.jpg',
    title_name='Image2Sim: Scaling Embodied Navigation via Generative Neural Simulator',
    author_list=[
        'Zihan Wang',
        'Seungjun Lee',
        'Yinghao Xu',
        'Gim Hee Lee',
    ],
    material_list=[
        ['NeurIPS 2026', 'https://arxiv.org/abs/2607.05765'],
        ['Code', 'https://github.com/MrZihan/Image2Sim'],
    ],
    award_name=null,
);

render_project(
    project_name='JODA',
    figure_path='./assets/projects/joda.jpg',
    title_name='JODA: Composable Joint Dynamics for Articulated Objects',
    author_list=[
        'Tianhong Gao',
        'Cheng Yu',
        'Yinghao Xu',
        'Mengyu Chu',
    ],
    material_list=[
        ['NeurIPS 2026', 'https://arxiv.org/abs/2605.09954'],
    ],
    award_name=null,
);

render_project(
    project_name='LingBotVideo',
    figure_path='./assets/projects/lingbot-video.mp4',
    title_name='LingBot-Video: Scaling Mixture-of-Experts Video Pretraining for Embodied Intelligence',
    author_list=[
        'Shuailei Ma',
        'Jiaqi Liao',
        'Xinyang Wang',
        'Jingjing Wang',
        'Chaoran Feng',
        'Zijing Hu',
        'Chong Bao',
        'Zichen Xi',
        'Yuqi Gan',
        'Weisen Wang',
        'Yanhong Zeng',
        'Qin Zhao',
        'Zifan Shi',
        'Wei Wu',
        'Hao Ouyang',
        'Qiuyu Wang',
        'Shangzhan Zhang',
        'Jiahao Shao',
        'Yipengjing Sun',
        'Liangxiao Hu',
        'Lunke Pan',
        'Nan Xue',
        'Kecheng Zheng',
        'Yinghao Xu',
        'Xing Zhu',
        'Yujun Shen',
        'Ka Leong Cheng',
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2607.07675'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-video'],
        ['Code', 'https://github.com/Robbyant/lingbot-video'],
        ['Model', 'https://huggingface.co/collections/robbyant/lingbot-video'],
    ],
    award_name=null,
);

render_project(
    project_name='LingBotWorld2',
    figure_path='./assets/projects/lingbot-world2.mp4',
    title_name='LingBot-World 2.0: Infinite Worlds with Versatile Interactions',
    author_list=[
        'Zelin Gao',
        'Qiuyu Wang',
        'Jiapeng Zhu',
        'Jingye Chen',
        'Zichen Liu',
        'Qingyan Bai',
        'Jiahao Wang',
        'Yufeng Yuan',
        'Hanlin Wang',
        'Yichong Lu',
        'Ka Leong Cheng',
        'Haojie Zhang',
        'Jian Gao',
        'Tianrui Feng',
        'Yuzheng Liu',
        'Yao Yao',
        'Yinghao Xu',
        'Xing Zhu',
        'Yujun Shen',
        'Hao Ouyang',
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2607.07534'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-world-v2'],
        ['Code', 'https://github.com/Robbyant/lingbot-world-v2'],
        ['Model', 'https://huggingface.co/robbyant/lingbot-world-v2-14b-causal-fast'],
    ],
    award_name=null,
);

render_project(
    project_name='LingBotVA2',
    figure_path='./assets/projects/lingbot-va2.mp4',
    title_name='LingBot-VA 2.0: Native Video-Action Pretraining for Generalizable Robot Control',
    author_list=[
        'Qihang Zhang',
        'Lin Li',
        'Luyao Zhang',
        'Shuai Yang (RobbyAnt)',
        'Yiming Luo',
        'Shuaiting Li',
        'Ruilin Wang',
        'Junke Wang',
        'Jiahao Shao',
        'Gangwei Xu',
        'Jiaming Zhou',
        'Yishu Shen',
        'Yudong Jin',
        'Fangyi Xu',
        'Shuailei Ma',
        'Jiaqi Liao',
        'Guanxing Lu',
        'Zifan Shi',
        'Yongkun Wen',
        'Yujie Zhao',
        'Weixuan Tang',
        'Xinyang Wang',
        'Chaojian Li',
        'Jiapeng Zhu',
        'Ka Leong Cheng',
        'Nan Xue',
        'Xing Zhu',
        'Yujun Shen',
        'Yinghao Xu',
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2607.08639'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-va-v2'],
    ],
    award_name=null,
);

render_project(
    project_name='LingBotVision',
    figure_path='./assets/projects/lingbot-vision.webp',
    title_name='LingBot-Vision: Vision Pretraining for Dense Spatial Perception',
    author_list=[
        'Zelin Fu',
        'Bin Tan',
        'Changjiang Sun',
        'Shaohui Liu',
        'Kecheng Zheng',
        'Yinghao Xu',
        'Xing Zhu',
        'Yujun Shen',
        'Nan Xue',
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2607.05247'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-vision'],
        ['Code', 'https://github.com/Robbyant/lingbot-vision'],
        ['Model', 'https://huggingface.co/collections/robbyant/lingbot-vision'],
    ],
    award_name=null,
);

render_project(
    project_name='RepWAM',
    figure_path='./assets/projects/repwam.png',
    title_name='RepWAM: World Action Modeling with Representation Visual-Action Tokenizers',
    author_list=[
        "Junke Wang",
        "Qihang Zhang",
        "Shuai Yang (RepWAM)",
        "Yiming Luo",
        "Yujun Shen",
        "Zuxuan Wu",
        "Yu-Gang Jiang",
        "Yinghao Xu", "corresponding",
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2606.13674'],
        ['Project Page', 'https://wdrink.github.io/RepWAM/'],
        ['Code', 'https://github.com/wdrink/RepWAM'],
    ],
    award_name=null,
);

render_project(
    project_name='NextForcing',
    figure_path='./assets/projects/nextforcing.mp4',
    title_name='Next Forcing: Causal World Modeling with Multi-Chunk Prediction',
    author_list=[
        "Gangwei Xu",
        "Qihang Zhang",
        "Jiaming Zhou",
        "Xing Zhu",
        "Yujun Shen",
        "Xin Yang",
        "Yinghao Xu", "corresponding",
    ],
    material_list=[
        ['NeurIPS 2026', 'https://arxiv.org/abs/2606.11187'],
        ['Project Page', 'https://gangweix.github.io/next-forcing/'],
        ['Code', 'https://github.com/gangweix/next-forcing'],
    ],
    award_name=null,
);

render_project(
    project_name='GAVLN',
    figure_path='./assets/projects/gavln.jpg',
    title_name='GA-VLN: Geometry-Aware BEV Representation for Efficient Vision-Language Navigation',
    author_list=[
        "Jiahao Yang",
        "Zihan Wang",
        "Xiangyang Li",
        "Xing Zhu",
        "Yujun Shen",
        "Yinghao Xu", "corresponding",
        "Shuqiang Jiang", "corresponding",
    ],
    material_list=[
        ['CVPR 2026', 'https://arxiv.org/abs/2605.22036'],
    ],
    award_name=null,
);

render_project(
    project_name='CausalWM',
    figure_path='./assets/projects/lingbot-va.mp4',
    title_name='Causal World Modeling for Robot Control',
    author_list=[
        "Lin Li", "equal",
        "Qihang Zhang", "equal",
        "Yiming Luo", "equal",
        "Shuai Yang (RobbyAnt)",
        "Ruilin Wang",
        "Fei Han",
        "Mingrui Yu",
        "Zelin Gao",
        "Nan Xue",
        "Xing Zhu",
        "Yujun Shen",
        "Yinghao Xu",
    ],
    material_list=[
        ['RSS 2026', 'https://arxiv.org/abs/2601.21998'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-va'],
        ['Code', 'https://github.com/Robbyant/lingbot-va'],
        ['Model', 'https://huggingface.co/collections/robbyant/lingbot-va']
    ],
    award_name='',
    conference_author_list=[
        "Lin Li", "equal",
        "Qihang Zhang", "equal",
        "Yiming Luo", "equal",
        "Shuai Yang (RobbyAnt)",
        "Ruilin Wang",
        "Fei Han",
        "Mingrui Yu",
        "Zelin Gao",
        "Nan Xue",
        "Boyu Zhou",
        "Xing Zhu",
        "Mingyu Ding",
        "Yujun Shen",
        "Yinghao Xu",
    ],
    conference_material_list=[
        ['RSS 2026', 'https://arxiv.org/abs/2601.21998'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-va'],
        ['Code', 'https://github.com/Robbyant/lingbot-va'],
        ['Model', 'https://huggingface.co/collections/robbyant/lingbot-va'],
    ],
);

render_project(
    project_name='OpenWM',
    figure_path='./assets/projects/lingbot-world.mp4',
    title_name='Advancing Open-source World Models',
    author_list=[
        "Zelin Gao",
        "Qiuyu Wang",
        "Yanhong Zeng",
        "Jiapeng Zhu",
        "Ka Leong Cheng",
        "Yixuan Li",
        "Hanlin Wang",
        "Yinghao Xu",
        "Shuailei Ma",
        "Yihang Chen",
        "Jie Liu",
        "Yansong Cheng",
        "Yao Yao",
        "Jiayi Zhu",
        "Yihao Meng",
        "Kecheng Zheng",
        "Qingyan Bai",
        "Jingye Chen",
        "Zehong Shen",
        "Yue Yu",
        "Xing Zhu",
        "Yujun Shen",
        "Hao Ouyang",
    ],
    material_list=[
        ['arXiv 2026', 'https://arxiv.org/abs/2601.20540'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-world'],
        ['Code', 'https://github.com/Robbyant/lingbot-world'],
        ['Model', 'https://huggingface.co/collections/robbyant/lingbot-world']
    ],
    award_name='',
);

render_project(
    project_name='MDM',
    figure_path='./assets/projects/lingbot-depth.mp4',
    title_name='Masked Depth Modeling for Spatial Perception',
    author_list=[
        "Bin Tan",
        "Changjiang Sun",
        "Xiage Qin",
        "Hanat Adai",
        "Zelin Fu",
        "Tianxiang Zhou",
        "Han Zhang",
        "Yinghao Xu",
        "Xing Zhu",
        "Yujun Shen",
        "Nan Xue",
    ],
    material_list=[
        ['ECCV 2026', 'https://arxiv.org/abs/2601.17895'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-depth'],
        ['Code', 'https://github.com/Robbyant/lingbot-depth'],
        ['Model', 'https://huggingface.co/collections/robbyant/lingbot-depth']
    ],
    award_name='',
);

render_project(
    project_name='SceneScribe1M',
    figure_path='./assets/projects/scenescribe.png',
    title_name='SceneScribe-1M: A Large-Scale Video Dataset with Comprehensive Geometric and Semantic Annotations',
    author_list=[
        "Yunnan Wang",
        "Kecheng Zheng",
        "Jianyuan Wang",
        "Minghao Chen",
        "David Novotny",
        "Christian Rupprecht",
        "Yinghao Xu",
        "Xing Zhu",
        "Wenjun Zeng",
        "Xin Jin",
        "Yujun Shen",
    ],
    material_list=[
        ['CVPR 2026', 'https://arxiv.org/abs/2604.07990'],
        ['Project Page', 'https://wangyunnan.github.io/SceneScribe-1M/'],
    ],
    award_name='Highlight',
);

render_project(
    project_name='Ditto',
    figure_path='./assets/projects/ditto.mp4',
    title_name='Ditto: Scaling Instruction-Based Video Editing with a High-Quality Synthetic Dataset',
    author_list=[
        "Qingyan Bai",
        "Qiuyu Wang",
        "Hao Ouyang",
        "Yue Yu",
        "Hanlin Wang",
        "Wen Wang",
        "Ka Leong Cheng",
        "Shuailei Ma",
        "Yanhong Zeng",
        "Zichen Liu",
        "Yinghao Xu",
        "Yujun Shen",
        "Qifeng Chen",
    ],
    material_list=[
        ['CVPR 2026', 'https://arxiv.org/abs/2510.15742'],
        ['Project Page', 'https://editto.net/'],
        ['Code', 'https://github.com/EzioBy/Ditto'],
        ['Model', 'https://huggingface.co/QingyanBai/Ditto_models'],
    ],
    award_name='Highlight',
);

render_project(
    project_name='GCT',
    figure_path='./assets/projects/lingbot-map.mp4',
    title_name='Geometric Context Transformer for Streaming 3D Reconstruction',
    author_list=[
        "Linzhuo Chen", "equal",
        "Jian Gao", "equal",
        "Yihang Chen",
        "Ka Leong Cheng",
        "Yipengjing Sun",
        "Liangxiao Hu",
        "Nan Xue",
        "Xing Zhu",
        "Yujun Shen",
        "Yao Yao", "corresponding",
        "Yinghao Xu", "corresponding",
    ],
    material_list=[
        ['ECCV 2026', 'https://arxiv.org/abs/2604.14141'],
        ['Project Page', 'https://technology.robbyant.com/lingbot-map'],
        ['Code', 'https://github.com/robbyant/lingbot-map'],
    ],
    award_name='Award Candidate (Top 10 Papers)',
);

render_project(
    project_name='FLARE',
    figure_path='./assets/projects/flare.jpg',
    title_name='FLARE: Feed-forward Geometry, Appearance and Camera Estimation from Uncalibrated Sparse Views',
    author_list=[
        "Shangzhan Zhang", "equal",
        "Jianyuan Wang", "equal",
        "Yinghao Xu", "equal", 
        "Nan Xue",
        "Christian Rupprecht",
        "Xiaowei Zhou",
        "Yujun Shen",
        "Gordon Wetzstein",
    ],
    material_list=[
        ['CVPR 2025', 'https://arxiv.org/abs/2502.12138'],
        ['Project Page', 'https://zhanghe3z.github.io/FLARE/'], 
        ['Code', 'https://github.com/ant-research/FLARE'],
        ['Demo', 'https://zhanghe3z.github.io/FLARE/videos/teaser_video.mp4']
    ],
);

render_project(
    project_name='MoC',
    figure_path='assets/projects/moc.mp4',
    title_name='Mixture of Contexts for Long Video Generation',
    author_list=[
        "Shengqu Cai",
        "Ceyuan Yang",
        "Lvmin Zhang",
        "Yuwei Guo",
        "Junfei Xiao",
        "Ziyan Yang",
        "Yinghao Xu",
        "Zhenheng Yang",
        "Alan Yuille",
        "Leonidas Guibas",
        "Maneesh Agrawala",
        "Lu Jiang",
        "Gordon Wetzstein",
    ],
    material_list=[
        ['ICLR 2026', 'https://arxiv.org/abs/2508.21058'],
        ['Project Page', 'https://primecai.github.io/moc/'],
    ],
    award_name='',
);

render_project(
    project_name='VWM',
    figure_path='assets/projects/spmem.jpg',
    title_name='Video World Models with Long-term Spatial Memory',
    author_list=[
        "Tong Wu",
        "Shuai Yang",
        "Ryan Po",
        "Yinghao Xu",
        "Ziwei Liu",
        "Dahua Lin",
        "Gordon Wetzstein",
    ],
    material_list=[
        ['NeurIPS 2025', 'https://arxiv.org/abs/2506.05284'],
        ['Project Page', 'https://spmem.github.io/'],
    ],
    award_name='',
);

render_project(
    project_name='ISA4D',
    figure_path='assets/projects/isa.mp4',
    title_name='Interspatial Attention for Efficient 4D Human Video Generation',
    author_list=[
        "Ruizhi Shao", "equal",
        "Yinghao Xu", "equal",
        "Yujun Shen",
        "Ceyuan Yang",
        "Yang Zheng",
        "Changan Chen",
        "Yebin Liu",
        "Gordon Wetzstein",
    ],
    material_list=[
        ['SIGGRAPH 2025', 'https://arxiv.org/abs/2505.15800'],
        ['Project Page', 'https://dsaurus.github.io/isa4d/'],
        ['Code', 'https://github.com/DSaurus/ISA4D_code'],
    ],
    award_name='',
);

render_project(
    project_name='GroomLight',
    figure_path='./assets/projects/groomlight.mp4',
    title_name='GroomLight: Hybrid Inverse Rendering for Relightable Human Hair Appearance Modeling',
    author_list=[
        "Yang Zheng",
        "Menglei Chai",
        "Delio Vicini",
        "Yuxiao Zhou",
        "Yinghao Xu",
        "Leonidas Guibas",
        "Gordon Wetzstein",
        "Thabo Beeler",
    ],
    material_list=[
        ['CVPR 2025', 'https://arxiv.org/abs/2503.10597'],
        ['Project Page', 'https://syntec-research.github.io/GroomLight'],
    ],
    award_name='',
);

render_project(
    project_name='CameraCtrl2',
    figure_path='./assets/projects/cameractrl2.mp4',
    title_name='CameraCtrl II: Dynamic Scene Exploration via Camera-controlled Video Diffusion Models',
    author_list=[
        "Hao He",
        "Ceyuan Yang",
        "Shanchuan Lin",
        "Yinghao Xu",
        "Meng Wei",
        "Liangke Gui",
        "Qi Zhao",
        "Gordon Wetzstein",
        "Lu Jiang",
        "Hongsheng Li",
    ],
    material_list=[
        ['ICCV 2025', 'https://arxiv.org/abs/2503.10592'],
        ['Project Page', 'https://hehao13.github.io/Projects-CameraCtrl-II/'],
    ],
    award_name='',
);

render_project(
    project_name='Edicho',
    figure_path='./assets/projects/edicho.jpg',
    title_name='Edicho: Consistent Image Editing in the Wild',
    author_list=[
        "Qingyan Bai",
        "Hao Ouyang",
        "Yinghao Xu",
        "Qiuyu Wang",
        "Ceyuan Yang",
        "Ka Leong Cheng",
        "Yujun Shen",
        "Qifeng Chen",
    ],
    material_list=[
        ['ICCV 2025', 'https://arxiv.org/abs/2412.21079'],
        ['Project Page', 'https://ant-research.github.io/edicho/'],
        ['Code', 'https://github.com/ant-research/edicho'],
    ],
    award_name='',
);


render_project(
    project_name='im2flow2act',
    figure_path='./assets/projects/im2flow2act.mp4',
    title_name='Flow as the Cross-domain Manipulation Interface',
    author_list=[
       "Mengda Xu",
       "Zhenjia Xu",
       "Yinghao Xu",
       "Cheng Chi",
       "Gordon Wetzstein",
       "Manuela Veloso",
       "Shuran Song",
    ],
    material_list=[
        ['CoRL 2024', 'https://arxiv.org/pdf/2407.15208'],
        ['Project Page', 'https://im-flow-act.github.io/'], 
        ['Code', 'https://github.com/real-stanford/im2Flow2Act']
    ],
    award_name='Oral at X-Embodiment Workshop',
);



render_project(
    project_name='CVD',
    figure_path='./assets/projects/cvd.mp4',
    title_name='Collaborative Video Diffusion: Consistent Multi-video Generation with Camera Control',
    author_list=[
       "Zhengfei Kuang", "equal",
       "Shengqu Cai", "equal",
       "Hao He", 
       "Yinghao Xu",
       "Hongsheng Li",
       "Leonidas Guibas",
       "Gordon Wetzstein", 
        ],
    material_list=[
        ['NeurIPS 2024', 'https://arxiv.org/abs/2405.17414'],
        ['Project Page', 'https://collaborativevideodiffusion.github.io/'],
        ['Code', 'https://github.com/CollaborativeVideoDiffusion/CVD']
    ],
    award_name='',
);


render_project(
    project_name='3DitScene',
    figure_path='./assets/projects/3ditscene.mp4',
    title_name='3DitScene: Editing Any Scene via Language-guided Disentangled Gaussian Splatting',
    author_list=[
        "Qihang Zhang",
        "Yinghao Xu",
        "Chaoyang Wang",
        "Hsin-Ying Lee",
        "Gordon Wetzstein",
        "Bolei Zhou",
        "Ceyuan Yang",
    ],
    material_list=[
        ['ICLR 2025', 'https://arxiv.org/abs/2405.18424'],
        ['Project Page', 'https://zqh0253.github.io/3DitScene/'],
        ['Code', 'https://github.com/zqh0253/3DitScene'], 
        ['Demo', 'https://huggingface.co/spaces/qihang/3Dit-Scene'],
    ],
    award_name='',
);

render_project(
    project_name='CameraCtrl',
    figure_path='./assets/projects/cameractrl.mp4',
    title_name='CameraCtrl: Enabling Camera Control for Video Diffusion Models',
    author_list=[
        "Hao He",
        "Yinghao Xu",
        "Yuwei Guo",
        "Gordon Wetzstein",
        "Bo Dai",
        "Hongsheng Li",
        "Ceyuan Yang",     
    ],
    material_list=[
        ['ICLR 2025', 'https://arxiv.org/abs/2404.02101'],
        ['Project Page', 'https://hehao13.github.io/projects-CameraCtrl/'],
        ['Code', 'https://github.com/hehao13/CameraCtrl'],
        ['Demo', 'https://huggingface.co/spaces/hehao13/CameraCtrl-svd']
    ],
    award_name='',
);

render_project(
    project_name='FiVA',
    figure_path='./assets/projects/fiva.png',
    title_name='FiVA: Fine-grained Visual Attribute Dataset for Text-to-Image Diffusion Models',
    author_list=[
        "Tong Wu",
        "Yinghao Xu",
        "Ryan Po",
        "Mengchen Zhang",
        "Guandao Yang",
        "Jiaqi Wang",
        "Ziwei Liu",
        "Dahua Lin",
        "Gordon Wetzstein",
    ],
    material_list=[
        ['NeurIPS 2024 Dataset Benchmark', ''],
    ],
    award_name='',
);



render_project(
    project_name='TGH',
    figure_path='./assets/projects/tgh.mp4',
    title_name='Representing Long Volumetric Video with Temporal Gaussian Hierarchy',
    author_list=[
       "Zhen Xu", "equal", 
       "Yinghao Xu", "equal", 
       "Zhiyuan Yu", "equal", 
       "Sida Peng",
        "Jiaming Sun", 
        "Hujun Bao", 
        "Xiaowei Zhou",
    ],
    material_list=[
        ['SIGGRAPH ASIA 2024 (Journal Track)', ''],
    ],
    award_name='',
);


render_project(
    project_name='3DPE',
    figure_path='./assets/projects/3dpe.jpg',
    title_name='Real-time 3D-aware Portrait Editing from a Single Image',
    author_list=[
       "Qingyan Bai", 
       "Zifan Shi", 
       "Yinghao Xu", 
       "Hao Ouyang",
        "Qiuyu Wang", 
        "Ceyuan Yang", 
        "Xuan Wang",
        "Gordon Wetzstein", 
        "Yujun Shen",
        "Qifeng Chen"
    ],
    material_list=[
        ['ECCV 2024', 'https://arxiv.org/pdf/2402.14000'],
        ['Project Page', 'https://ezioby.github.io/3dpe/'],
        ['Code', 'https://github.com/EzioBy/3dpe'],
    ],
    award_name='',
);


render_project(
    project_name='GRM',
    figure_path='./assets/projects/grm.mp4',
    title_name='GRM: Large Gaussian Reconstruction Model for Efficient 3D Reconstruction and Generation',
    author_list=[
        "Yinghao Xu", 'equal',
        "Zifan Shi", 'equal',
        "Wang Yifan", 
        "Hansheng Chen", 
        "Ceyuan Yang", 
        "Sida Peng", 
        "Yujun Shen", 
        "Gordon Wetzstein"
    ],
    material_list=[
        ['ECCV 2024', 'https://arxiv.org/pdf/2403.14621'],
        ['Project Page', 'https://justimyhxu.github.io/projects/grm/'],
        ['Code', 'https://github.com/justimyhxu/GRM'],
    ],
    award_name='',
);


render_project(
    project_name='BerfScene',
    figure_path='./assets/projects/berfscene.mp4',
    title_name='BerfScene: Bev-conditioned Equivariant Radiance Fields for Infinite 3D Scene Generation',
    author_list=[
        "Qihang Zhang", 
        "Yinghao Xu", 
        "Yujun Shen", 
        "Bo Dai", 
        "Bolei Zhou",
        "Ceyuan Yang"
    ],
    material_list=[
        ['CVPR 2024', 'https://arxiv.org/pdf/2312.02136'],
        ['Project Page', 'https://zqh0253.github.io/BerfScene/'],
        ['Code', 'https://github.com/zqh0253/BerfScene'],
    ],
    award_name='',
);


render_project(
    project_name='SceneWiz',
    figure_path='./assets/projects/scenewiz3d.gif',
    title_name='SceneWiz3D: Towards Text-guided 3D Scene Composition',
    author_list=[
        "Qihang Zhang", 
        "Chaoyang Wang", 
        "Aliaksandr Siarohin", 
        "Peiye Zhuang", 
        "Yinghao Xu", 
        "Ceyuan Yang", 
        "Dahua Lin", 
        "Bolei Zhou", 
        "Sergey Tulyakov", 
        "Hsin-Ying Lee"
    ],
    material_list=[
        ['CVPR 2024', 'https://arxiv.org/pdf/2312.08885'],
        ['Project Page', 'https://zqh0253.github.io/SceneWiz3D/'],
        ['Code', 'https://github.com/zqh0253/SceneWiz3D'],
    ],
    award_name='',
);

render_project(
    project_name='GSM',
    figure_path='./assets/projects/gsm.mp4',
    title_name='Gaussian Shell Maps for Efficient 3D Human Generation',
    author_list=[
        "Rameen Abdal",'equal',
        "Wang Yifan", 'equal',
        "Zifan Shi", 'equal',
        "Yinghao Xu", 
        "Ryan Po", 
        "Zhengfei Kuang", 
        "Qifeng Chen", 
        "Dit-Yan Yeung", 
        "Gordon Wetzstein",
    ],
    material_list=[
        ['CVPR 2024', 'https://arxiv.org/pdf/2311.17857'],
        ['Project Page', 'https://rameenabdal.github.io/GaussianShellMaps/'],
        ['Code', 'https://github.com/computational-imaging/GSM'],
    ],
    award_name='',
);


render_project(
    project_name='PFLRM',
    figure_path='./assets/projects/pflrm.gif',
    title_name='PF-LRM: Pose-Free Large Reconstruction Model for Joint Pose and Shape Prediction',
    author_list=[
        "Peng Wang", 
        "Hao Tan",
        "Sai Bi", 
        "Yinghao Xu", 
        "Fujun Luan",
        "Kalyan Sunkavalli", 
        "Wenping Wang", 
        "Zexiang Xu", 
        "Kai Zhang",
    ],
    material_list=[
        ['ICLR 2024', 'https://arxiv.org/pdf/2311.12024.pdf'],
        ['Project Page', 'https://totoro97.github.io/pf-lrm'],
    ],
    award_name='Spotlight',
);


render_project(
    project_name='DMV3D',
    figure_path='./assets/projects/dmv3d.mp4',
    title_name='DMV3D:Denoising Multi-View Diffusion using 3D Large Reconstruction Model',
    author_list=[
        'Yinghao Xu',
        'Hao Tan', 
        'Fujun Luan',
        'Sai Bi',
        'Peng Wang', 
        'Jiahao Li', 
        'Zifan Shi', 
        'Kalyan Sunkavalli', 
        'Gordon Wetzstein', 
        'Zexiang Xu',
        'Kai Zhang',
    ],
    material_list=[
        ['ICLR 2024', 'https://arxiv.org/pdf/2311.09217.pdf'],
        ['Project Page', 'https://justimyhxu.github.io/projects/dmv3d/'],
    ],
    award_name='Spotlight',
);


render_project(
    project_name='Instant3D',
    figure_path='./assets/projects/instant3d.mp4',
    title_name='Instant3D: Fast Text-to-3D with Sparse-View Generation and Large Reconstruction Model',
    author_list=[
        'Jiahao Li', 
        'Hao Tan', 
        'Kai Zhang', 
        'Zexiang Xu', 
        'Fujun Luan', 
        'Yinghao Xu', 
        'Yicong Hong', 
        'Kalyan Sunkavalli', 
        'Greg Shakhnarovich', 
        'Sai Bi',

    ],
    material_list=[
        ['ICLR 2024', 'https://arxiv.org/pdf/2311.06214.pdf'],
        ['Project Page', 'https://jiahao.ai/instant3d/'],
    ],
    award_name=null,
);


render_project(
    project_name='Aurora',
    figure_path='./assets/projects/aurora.jpg',
    title_name='Exploring Sparse MoE in GANs for Text-conditioned Image Synthesis',
    author_list=[
        'Jiapeng Zhu',
        'Ceyuan Yang',
        'Zifan Shi',
        'Kecheng Zheng',
        'Yinghao Xu',
        'Yujun Shen',
    ],
    material_list=[
        ['arxiv', 'https://arxiv.org/pdf/2309.03904.pdf'],
        ['Code', 'https://github.com/zhujiapeng/Aurora'],
    ],
    award_name=null,
);

render_project(
    project_name='MTM',
    figure_path='./assets/projects/mtm.png',
    title_name='Learning Modulated Transformation in GANs',
    author_list=[
        'Ceyuan Yang',
        'Qihang Zhang',
        'Yinghao Xu',
        'Jiapeng Zhu',
        'Yujun Shen',
        'Bo Dai',
    ],
    material_list=[
        ['NeurIPS 2023', 'https://arxiv.org/pdf/2308.15472.pdf'],
        ['Code', 'https://github.com/limbo0000/mtm'],
    ],
    award_name=null,
);

render_project(
    project_name='IDInvert',
    figure_path='./assets/projects/idinvert.jpg',
    title_name='In-Domain GAN Inversion for Real Image Editing',
    author_list=[
        'Jiapeng Zhu', 'equal',
        'Yujun Shen', 'equal',
        'Yinghao Xu', 
        'Deli Zhao',
        'Qifeng Chen',
        'Bolei Zhou',
    ],
    material_list=[
        ['TPAMI 2023', 'https://arxiv.org/pdf/xxxx.xxxxx.pdf'],
        ['Project', 'https://genforce.github.io/idinvert/'],
        ['Code (TensorFlow)', 'https://github.com/genforce/idinvert'],
        ['Code (PyTorch)', 'https://github.com/genforce/idinvert_pytorch'],
        ['Demo', 'https://www.youtube.com/watch?v=3v6NHrhuyFY'],
        ['Colab', 'https://colab.research.google.com/github/genforce/idinvert_pytorch/blob/master/docs/Idinvert.ipynb'],
    ],
    award_name=null,
);

render_project(
    project_name='Carver',
    figure_path='./assets/projects/carver.jpg',
    title_name='Benchmarking and Analyzing 3D-aware Image Synthesis with a Modularized Codebase',
    author_list=[
        'Qiuyu Wang',
        'Zifan Shi',
        'Kecheng Zheng',
        'Yinghao Xu',
        'Sida Peng',
        'Yujun Shen', 'corresponding',
    ],
    material_list=[
        ['NeurIPS 2023', 'https://arxiv.org/pdf/2306.12423.pdf'],
        ['Code', 'https://github.com/qiuyu96/carver'],
    ],
    award_name=null,
);

render_project(
    project_name='LSVGAN',
    figure_path='./assets/projects/lsvgan.jpg',
    title_name='Efficient 3D Articulated Human Generation with Layered Surface Volumes',
    author_list=[
        'Yinghao Xu',
        'Wang Yifan', 
        'Alexander W. Bergman',
        'Menglei Chai', 
        'Bolei Zhou', 
        'Gordon Wetzstein',
    ],
    material_list=[
        ['3DV 2024', 'https://arxiv.org/abs/2307.05462'],
        ['Project', 'https://www.computationalimaging.org/publications/lsv/'],
    ],
    award_name='Spotlight',
);

render_project(
    project_name='3D Survey',
    figure_path='./assets/projects/survey3d.png',
    title_name='3D Generative Models: A Survey',
    author_list=[
        'Zifan Shi', 'equal',
        'Sida Peng', 'equal',
        'Yinghao Xu', 'equal',
        'Andreas Geiger',
        'Yiyi Liao', 'corresponding',
        'Yujun Shen', 'corresponding',
    ],
    material_list=[
        ['arXiv', 'https://arxiv.org/pdf/2210.15663.pdf'],
        ['Project', 'https://github.com/justimyhxu/awesome-3D-generation'],
    ],
    award_name=null,
);

render_project(
    project_name='GenDA',
    figure_path='./assets/projects/genda.jpg',
    title_name='One-Shot Generative Domain Adaptation',
    author_list=[
        'Ceyuan Yang', 'equal',
        'Yujun Shen', 'equal',
        'Zhiyi Zhang',
        'Yinghao Xu',
        'Jiapeng Zhu',
        'Zhirong Wu',
        'Bolei Zhou',
    ],
    material_list=[
        ['ICCV 2023', 'https://arxiv.org/pdf/2111.09876.pdf'],
        ['Project', 'https://genforce.github.io/genda/'],
        ['Code', 'https://github.com/genforce/genda'],
    ],
    award_name=null,
);

render_project(
    project_name='PoF3D',
    figure_path='./assets/projects/pof3d.png',
    title_name='Learning 3D-aware Image Synthesis with Unknown Pose Distribution',
    author_list=[
        'Zifan Shi', 'equal',
        'Yujun Shen', 'equal',
        'Yinghao Xu',
        'Sida Peng',
        'Yiyi Liao',
        'Sheng Guo',
        'Qifeng Chen',
        'Dit-Yan Yeung',
    ],
    material_list=[
        ['CVPR 2023', 'https://arxiv.org/pdf/2301.07702.pdf'],
        ['Project', 'https://vivianszf.github.io/pof3d/'],
        ['Code', 'https://github.com/vivianszf/pof3d'],
        ['Demo', 'https://www.youtube.com/watch?v=nvlyAElC8eE'],
    ],
    award_name=null,
);

render_project(
    project_name='DisCoScene',
    figure_path='./assets/projects/discoscene.gif',
    title_name='DiscoScene: Spatially Disentangled Generative Radiance Field for Controllable 3D-aware Scene Synthesis',
    author_list=[
        'Yinghao Xu',
        'Menglei Chai',
        'Zifan Shi',
        'Sida Peng',
        'Ivan Skorokhodov',
        'Aliaksandr Siarohin',
        'Ceyuan Yang',
        'Yujun Shen',
        'Hsin-Ying Lee',
        'Bolei Zhou',
        'Sergey Tulyakov',
    ],
    material_list=[
        ['CVPR 2023', 'https://arxiv.org/pdf/2212.11984.pdf'],
        ['Project', 'https://snap-research.github.io/discoscene/'],
        ['Code', 'https://github.com/snap-research/discoscene'],
        ['Demo', 'https://www.youtube.com/watch?v=Fvenkw7yeok'],
    ],
    award_name='Highlight presentation',
);

render_project(
    project_name='GLeaD',
    figure_path='./assets/projects/glead.png',
    title_name='GLeaD: Improving GANs with A Generator-Leading Task',
    author_list=[
        'Qingyan Bai',
        'Ceyuan Yang',
        'Yinghao Xu',
        'Xihui Liu',
        'Yujiu Yang',
        'Yujun Shen',
    ],
    material_list=[
        ['CVPR 2023', 'https://arxiv.org/pdf/2212.03752.pdf'],
        ['Project', 'https://ezioby.github.io/glead/'],
        ['Code', 'https://github.com/EzioBy/glead'],
    ],
    award_name=null,
);

render_project(
    project_name='StyleSV',
    figure_path='./assets/projects/stylesv.mp4',
    title_name='Towards Smooth Video Composition',
    author_list=[
        'Qihang Zhang',
        'Ceyuan Yang',
        'Yujun Shen',
        'Yinghao Xu',
        'Bolei Zhou',
    ],
    material_list=[
        ['ICLR 2023', 'https://arxiv.org/pdf/2212.07413.pdf'],
        ['Project', 'https://genforce.github.io/StyleSV/'],
        ['Code', 'https://github.com/genforce/StyleSV'],
    ],
    award_name=null,
);

render_project(
    project_name="3DGP",
    figure_path='./assets/projects/3dgp.png',
    title_name='3D Generation on ImageNet',
    author_list=[
        'Ivan Skorokhodov',
        'Aliaksandr Siarohin',
        'Yinghao Xu',
        'Jian Ren',
        'Hsin-Ying Lee',
        'Peter Wonka',
        'Sergey Tulyakov',
    ],
    material_list=[
        ['ICLR 2023', 'https://arxiv.org/abs/2303.01416'],
        ['Project', 'https://snap-research.github.io/3dgp/'],
        ['Code', 'https://github.com/snap-research/3dgp']
    ],
    award_name='Oral',
)

render_project(
    project_name='GH-Feat-TPAMI',
    figure_path='./assets/projects/ghfeat-pami.png',
    title_name='GH-Feat: Learning Versatile Generative Hierarchical Features from GANs',
    author_list=[
        'Yinghao Xu',
        'Yujun Shen',
        'Jiapeng Zhu',
        'Ceyuan Yang',
        'Bolei Zhou',
    ],
    material_list=[
        ['TPAMI 2023', 'https://arxiv.org/pdf/2301.05315.pdf'],
        ['Project', 'https://genforce.github.io/ghfeat/'],
        ['Code', 'https://github.com/genforce/ghfeat'],
    ],
    award_name=null,
);

render_project(
    project_name='GeoD',
    figure_path='./assets/projects/geod.jpg',
    title_name='Improving 3D-aware Image Synthesis with A Geometry-aware Discriminator',
    author_list=[
        'Zifan Shi',
        'Yinghao Xu',
        'Yujun Shen',
        'Deli Zhao',
        'Qifeng Chen',
        'Dit-Yan Yeung',
    ],
    material_list=[
        ['NeurIPS 2022', 'https://arxiv.org/pdf/2209.15637.pdf'],
        ['Project', 'https://vivianszf.github.io/geod/'],
        ['Code', 'https://github.com/vivianszf/geod'],
        ['Demo', 'https://www.youtube.com/watch?v=qqAxEMSUYiE'],
    ],
    award_name='Spotlight',
);

render_project(
    project_name='DynamicD',
    figure_path='./assets/projects/dynamicd.png',
    title_name='Improving GANs with A Dynamic Discriminator',
    author_list=[
        'Ceyuan Yang', 'equal',
        'Yujun Shen', 'equal',
        'Yinghao Xu',
        'Deli Zhao',
        'Bo Dai',
        'Bolei Zhou',
    ],
    material_list=[
        ['NeurIPS 2022', 'https://arxiv.org/pdf/2209.09897.pdf'],
        ['Project', 'https://genforce.github.io/dynamicd/'],
        ['Code', 'https://github.com/genforce/dynamicd'],
    ],
    award_name=null,
);

render_project(
    project_name='PadInv',
    figure_path='./assets/projects/padinv.jpg',
    title_name='High-fidelity GAN Inversion with Padding Space',
    author_list=[
        'Qingyan Bai', 'equal',
        'Yinghao Xu', 'equal',
        'Jiapeng Zhu',
        'Weihao Xia',
        'Yujiu Yang',
        'Yujun Shen',
    ],
    material_list=[
        ['ECCV 2022', 'https://arxiv.org/pdf/2203.11105.pdf'],
        ['Project', 'https://ezioby.github.io/padinv/'],
        ['Code', 'https://github.com/ezioby/padinv'],
    ],
    award_name=null,
);

render_project(
    project_name='SSPNeRF',
    figure_path='./assets/projects/ssp_nerf.png',
    title_name='Semantic-Aware Implicit Neural Audio-Driven Video Portrait Generation',
    author_list=[
        'Xian Liu',
        'Yinghao Xu',
        'Qianyi Wu',
        'Hang Zhou',
        'Wayne Wu',
        'Bolei Zhou',
    ],
    material_list=[
        ['ECCV 2022', 'https://arxiv.org/pdf/2201.07786.pdf'],
        ['Project', 'https://alvinliu0.github.io/projects/SSP-NeRF'],
        ['Code', 'https://github.com/alvinliu0/SSP-NeRF'],
    ],
    award_name='Oral',
);

render_project(
    project_name='HA2G',
    figure_path='./assets/projects/ha2g.png',
    title_name='Learning Hierarchical Cross-Modal Association for Co-Speech Gesture Generation',
    author_list=[
        'Xian Liu',
        'Qianyi Wu',
        'Hang Zhou',
        'Yinghao Xu',
        'Xinyi Lin',
        'Xiaowei Zhou',
        'Wayne Wu',
        'Bolei Zhou',
    ],
    material_list=[
        ['CVPR 2022', 'https://arxiv.org/pdf/2203.13161.pdf'],
        ['Project', 'https://alvinliu0.github.io/projects/HA2G'],
        ['Code', 'https://github.com/alvinliu0/HA2G'],
    ],
    award_name=null,
);


render_project(
    project_name='ReSeFa',
    figure_path='./assets/projects/resefa.jpg',
    title_name='Region-Based Semantic Factorization in GANs',
    author_list=[
        'Jiapeng Zhu',
        'Yujun Shen',
        'Yinghao Xu',
        'Deli Zhao',
        'Qifeng Chen',
    ],
    material_list=[
        ['ICML 2022', 'https://arxiv.org/pdf/2112.10759.pdf'],
        ['Project', 'https://zhujiapeng.github.io/resefa/'],
        ['Code', 'https://github.com/zhujiapeng/resefa'],
        ['Colab', 'https://colab.research.google.com/github/zhujiapeng/resefa/blob/main/docs/resefa.ipynb'],
    ],
    award_name=null,
);

render_project(
    project_name='VolumeGAN',
    figure_path='./assets/projects/volumegan.png',
    title_name='3D-aware Image Synthesis via Learning Structural and Textural Representations',
    author_list=[
        'Yinghao Xu',
        'Sida Peng',
        'Ceyuan Yang',
        'Yujun Shen',
        'Bolei Zhou',
    ],
    material_list=[
        ['CVPR 2022', 'https://arxiv.org/pdf/2112.10759.pdf'],
        ['Project', 'https://genforce.github.io/volumegan/'],
        ['Code', 'https://github.com/genforce/volumegan'],
        ['Demo', 'https://www.youtube.com/watch?v=p85TVGJBMFc'],
    ],
    award_name=null,
);

render_project(
    project_name='EqGAN',
    figure_path='./assets/projects/eqgan.jpg',
    title_name='Improving GAN Equilibrium by Raising Spatial Awareness',
    author_list=[
        'Jianyuan Wang',
        'Ceyuan Yang',
        'Yinghao Xu',
        'Yujun Shen',
        'Hongdong Li',
        'Bolei Zhou',
    ],
    material_list=[
        ['CVPR 2022', 'https://arxiv.org/pdf/2112.00718.pdf'],
        ['Extension', 'https://arxiv.org/pdf/2301.08455.pdf'],
        ['Project', 'https://genforce.github.io/eqgan/'],
        ['Code', 'https://github.com/genforce/eqgan'],
        ['Demo', 'https://www.youtube.com/watch?v=k7sG4XY5rIc'],
    ],
    award_name=null,
);

render_project(
    project_name='CMPL',
    figure_path='./assets/projects/cmpl.png',
    title_name='Cross-Model Pseudo-Labeling for Semi-Supervised Action Recognition',
    author_list=[
        'Yinghao Xu',
        'Fangyun Wei',
        'Xiao Sun',
        'Ceyuan Yang',
        'Yujun Shen',
        'Bo Dai',
        'Bolei Zhou',
        'Stephen Lin',
    ],
    material_list=[
        ['CVPR 2022', 'https://arxiv.org/pdf/2112.09690.pdf'],
        ['Project', 'https://justimyhxu.github.io/projects/cmpl/'],
    ],
    award_name='Oral',
);

render_project(
    project_name='InsGen',
    figure_path='./assets/projects/insgen.jpg',
    title_name='Data-Efficient Instance Generation from Instance Discrimination',
    author_list=[
        'Ceyuan Yang',
        'Yujun Shen',
        'Yinghao Xu',
        'Bolei Zhou',
    ],
    material_list=[
        ['NeurIPS 2021', 'https://arxiv.org/pdf/2106.04566.pdf'],
        ['Project', 'https://genforce.github.io/insgen/'],
        ['Code', 'https://github.com/genforce/insgen'],
    ],
    award_name=null,
);

render_project(
    project_name='ObjectNeRF',
    figure_path='./assets/projects/objectnerf.png',
    title_name='Learning Object-Compositional Neural Radiance Field for Editable Scene Rendering',
    author_list=[
        'Bangbang Yang',
        'Yinda Zhang',
        'Yinghao Xu',
        'Yijin Li',
        'Han Zhou',
        'Hujun Bao',
        'Guofeng Zhang',
        'Zhaopeng Cui',
    ],
    material_list=[
        ['NeurIPS 2021', 'https://arxiv.org/pdf/2106.04566.pdf'],
        ['Project', 'https://genforce.github.io/insgen/'],
        ['Code', 'https://github.com/genforce/insgen'],
    ],
    award_name=null,
)

render_project(
    project_name='GH-Feat',
    figure_path='./assets/projects/ghfeat.png',
    title_name='Generative Hierarchical Features from Synthesizing Images',
    author_list=[
        'Yinghao Xu', 'equal',
        'Yujun Shen', 'equal',
        'Jiapeng Zhu',
        'Ceyuan Yang',
        'Bolei Zhou',
    ],
    material_list=[
        ['CVPR 2021', 'https://arxiv.org/pdf/2007.10379.pdf'],
        ['Project', 'https://genforce.github.io/ghfeat/'],
        ['Code', 'https://github.com/genforce/ghfeat'],
    ],
    award_name='Oral',
);

render_project(
    project_name='Neuralbody',
    figure_path='./assets/projects/nueralbody.png',
    title_name='Neural Body: Implicit Neural Representations with Structured Latent Codes for Novel View Synthesis of Dynamic Humans',
    author_list=[
        'Sida Peng',
        'Yuanqing Zhang',
        'Yinghao Xu',
        'Qianqian Wang',
        'Qing Shuai',
        'Hujun Bao',
        'Xiaowei Zhou',
    ],
    material_list=[
        ['TPAMI 2023', 'https://ieeexplore.ieee.org/document/10045794'],
        ['CVPR 2021', 'https://arxiv.org/pdf/2012.15838.pdf'],
        ['Project', 'https://zju3dv.github.io/neuralbody'],
        ['Code', 'https://github.com/zju3dv/neuralbody'],
    ],
    award_name='Best paper candidate',
)

render_project(
    project_name='CompConv',
    figure_path='./assets/projects/compconv.png',
    title_name='CompConv: A Compact Convolution Module for Efficient Feature Learning',
    author_list=[
        'Chen Zhang',
        'Yinghao Xu',
        'Yujun Shen', 'corresponding',
    ],
    material_list=[
        ['CVPRW 2021', 'https://arxiv.org/pdf/2106.10486.pdf'],
    ],
    award_name=null,
);

render_project(
    project_name='LoGAN',
    figure_path='./assets/projects/logan.jpg',
    title_name='Decorating Your Own Bedroom: Locally Controlling Image Generation with Generative Adversarial Networks',
    author_list=[
        'Chen Zhang',
        'Yinghao Xu',
        'Yujun Shen', 'corresponding',
    ],
    material_list=[
        ['CVPRW 2021', 'https://arxiv.org/pdf/2105.08222.pdf'],
    ],
    award_name=null,
);

render_project(
    project_name='Ultra',
    figure_path='./assets/projects/landmark.png',
    title_name='Unsupervised Landmark Learning from Unpaired Data',
    author_list=[
        'Yinghao Xu',
        'Ceyuan Yang',
        'Ziwei Liu',
        'Bo Dai',
        'Bolei Zhou'
    ],
    material_list=[
        ['arxiv', 'https://arxiv.org/pdf/2007.01053.pdf'],
        ['Project', 'https://github.com/justimyhxu/ULTRA'],
    ],
    award_name=null,
);

render_project(
    project_name='VTHCL',
    figure_path='./assets/projects/vthcl.png',
    title_name='Video Representation Learning with Visual Tempo Consistency',
    author_list=[
        'Ceyuan Yang',
        'Yinghao Xu',
        'Bo Dai',
        'Bolei Zhou'
    ],
    material_list=[
        ['arxiv', 'https://arxiv.org/pdf/2007.01053.pdf'],
        ['Project', 'https://github.com/justimyhxu/ULTRA'],
    ],
    award_name=null,
);

render_project(
    project_name='DenseReppoints',
    figure_path='./assets/projects/densereppoints.png',
    title_name='Dense RepPoints: Representing Visual Objects with Dense Point Sets',
    author_list=[
        'Yinghao Xu', 'equal',
        'Ze Yang', 'equal',
        'Han Xue', 'equal',
        'Raquel Urtasun',
        'Liwei Wang',
        'Stephen Lin',
        'Han Hu'
    ],
    material_list=[
        ['ECCV 2020', 'https://arxiv.org/pdf/1912.11473.pdf'],
        ['Code', 'https://github.com/justimyhxu/Dense-RepPoints'],
    ],
    award_name=null,
);


render_project(
    project_name='TPN',
    figure_path='./assets/projects/TPN.png',
    title_name='Temporal Pyramid Network for Action Recognition',
    author_list=[
        'Ceyuan Yang', 'equal',
        'Yinghao Xu', 'equal',
        'Jianping Shi',
        'Bo Dai',
        'Bolei Zhou'
    ],
    material_list=[
        ['CVPR 2020', 'https://arxiv.org/pdf/2004.03548.pdf'],
        ['Project', 'https://decisionforce.github.io/TPN/'],
        ['Code', 'https://github.com/decisionforce/TPN']
    ],
    award_name=null,
);

render_project(
    project_name='BNN',
    figure_path='./assets/projects/bnn.png',
    title_name='A Main/Subsidiary Network Framework for Simplifying Binary Networks',
    author_list=[
        'Yinghao Xu',
        'Xin Dong',
        'Yudian Li',
        'Hao Su',
    ],
    material_list=[
        ['CVPR 2019', 'https://arxiv.org/abs/1812.04210'],
        ['Code', 'https://github.com/justimyhxu/MainSubsidaryBNN'],
    ],
    award_name=null,
);








// Authors.

render_author('Alexander W. Bergman', 'https://alexanderbergman7.github.io/');
render_author('Aliaksandr Siarohin', 'https://aliaksandrsiarohin.github.io/aliaksandr-siarohin-website/');
render_author('Andreas Geiger', 'https://www.cvlibs.net/');
render_author('Bangbang Yang', 'https://ybbbbt.com/');
render_author('Bo Dai', 'http://daibo.info/');
render_author('Bolei Zhou', 'https://boleizhou.github.io/');
render_author('Ceyuan Yang', 'https://ceyuan.me/');
render_author('Chaoyang Wang', 'https://mightychaos.github.io/');
render_author('Chen Zhang');
render_author('Cheng Chi', 'https://cheng-chi.github.io/');
render_author('Christian Rupprecht', 'https://chrirupp.github.io/');
render_author('Dahua Lin', 'http://dahua.site/');
render_author('Deli Zhao', 'https://scholar.google.com/citations?user=7LhjCn0AAAAJ');
render_author('Dit-Yan Yeung', 'https://sites.google.com/view/dyyeung');
render_author('Fangyun Wei', 'https://scholar.google.com/citations?user=-ncz2s8AAAAJ');
render_author('Fujun Luan', 'https://luanfujun.com/');
render_author('Greg Shakhnarovich', 'https://home.ttic.edu/~gregory/');
render_author('Gordon Wetzstein', 'https://stanford.edu/~gordonwz/');
render_author('Guandao Yang', 'https://www.guandaoyang.com/');
render_author('Guofeng Zhang', 'http://www.cad.zju.edu.cn/home/gfzhang/');
render_author('Han Hu', 'https://ancientmooner.github.io/');
render_author('Han Xue', 'https://xuenan.net/');
render_author('Han Zhou');
render_author('Hang Zhou', 'https://hangz-nju-cuhk.github.io/');
render_author('Hansheng Chen', 'https://lakonik.github.io/');
render_author('Hao Ouyang', 'https://ken-ouyang.github.io/');
render_author('Hao He', 'https://hehao13.github.io/');
render_author('Hao Su', 'https://cseweb.ucsd.edu/~haosu/');
render_author('Hao Tan', 'https://www.cs.unc.edu/~airsplay/');
render_author('Hsin-Ying Lee', 'http://hsinyinglee.com/');
render_author('Hongsheng Li', 'https://www.ee.cuhk.edu.hk/~hsli/');
render_author('Hongdong Li', 'https://scholar.google.com/citations?user=Mq89JAcAAAAJ');
render_author('Hujun Bao', 'http://www.cad.zju.edu.cn/home/bao/');
render_author('Ivan Skorokhodov', 'https://universome.github.io/');
render_author('Jiahao Li', 'https://jiahao.ai/');
render_author('Jiaming Sun', 'https://jiamingsun.me/');
render_author('Jian Ren', 'https://alanspike.github.io/');
render_author('Jianping Shi', 'https://shijianping.me/');
render_author('Jianyuan Wang', 'https://jytime.github.io/');
render_author('Jiaqi Wang', 'https://myownskyw7.github.io/');
render_author('Jiapeng Zhu', 'https://scholar.google.com/citations?user=-ACBm-gAAAAJ');
render_author('Kai Zhang', 'https://kai-46.github.io/website/');
render_author('Kecheng Zheng', 'https://scholar.google.com/citations?user=hMDQifQAAAAJ');
render_author('Kalyan Sunkavalli', 'http://www.kalyans.org/');
render_author('Liwei Wang', 'http://www.liweiwang-pku.com/');
render_author('Leonidas Guibas', 'https://geometry.stanford.edu/');
render_author('Mengda Xu', 'https://mengdaxu.github.io/');
render_author('Menglei Chai', 'https://mlchai.com/');
render_author('Mengchen Zhang', 'https://kszpxxzmc.github.io/');
render_author('Manuela Veloso', 'https://www.jpmorgan.com/technology/artificial-intelligence/about/manuela-veloso');
render_author('Nan Xue', 'https://xuenan.net/');
render_author('Peter Wonka', 'https://peterwonka.net/');
render_author('Peng Wang', 'https://totoro97.github.io/');
render_author('Qianqian Wang', 'https://www.cs.cornell.edu/~qqw/');
render_author('Qianyi Wu', 'https://scholar.google.com/citations?user=XI0RtesAAAAJ');
render_author('Qifeng Chen', 'https://cqf.io/');
render_author('Qihang Zhang', 'https://zqh0253.github.io');
render_author('Qing Shuai', 'https://chingswy.github.io/');
render_author('Qingyan Bai', 'https://scholar.google.com/citations?user=xUMjxi4AAAAJ');
render_author('Qiuyu Wang', 'https://github.com/qiuyu96');
render_author('Rameen Abdal', 'https://rameenabdal.github.io/');
render_author('Ruizhi Shao', 'https://ruizhis.github.io/');
render_author('Raquel Urtasun', 'http://www.cs.toronto.edu/~urtasun/');
render_author('Ryan Po', 'https://ryanpo.com/');
render_author('Sai Bi', 'https://sai-bi.github.io/');
render_author('Sergey Tulyakov', 'http://www.stulyakov.com/');
render_author('Shangzhan Zhang', 'https://zhanghe3z.github.io');
render_author('Sheng Guo', 'https://scholar.google.com/citations?user=mbpgOmEAAAAJ');
render_author('Shengqu Cai', 'https://primecai.github.io/');
render_author('Shuran Song', 'https://shurans.github.io/');
render_author('Sida Peng', 'https://pengsida.net/');
render_author('Stephen Lin', 'https://scholar.google.com/citations?user=c3PYmxUAAAAJ');
render_author('Tong Wu', 'https://wutong16.github.io/');
render_author('Weihao Xia', 'https://scholar.google.com/citations?user=Egqp5AMAAAAJ');
render_author('Wang Yifan', 'https://yifita.netlify.app/');
render_author('Wayne Wu', 'https://wywu.github.io/');
render_author('Wenping Wang', 'https://www.cs.hku.hk/people/academic-staff/wenping');
render_author('Xian Liu', 'https://alvinliu0.github.io/');
render_author('Xiao Sun', 'https://jimmysuen.github.io/');
render_author('Xiaowei Zhou', 'https://xzhou.me/');
render_author('Xuan Wang', 'https://xuanwangvc.github.io/');
render_author('Xin Dong', 'http://simonxin.com/');
render_author('Yicong Hong', 'https://yiconghong.me/');
render_author('Yifei Zhang');
render_author('Yijin Li', 'https://eugenelyj.github.io/');
render_author('Yinghao Xu', 'https://justimyhxu.github.io/');
render_author('Yinda Zhang', 'https://www.zhangyinda.com/');
render_author('Yingya Zhang', 'https://scholar.google.com/citations?user=16RDSEUAAAAJ');
render_author('Yiyi Liao', 'https://yiyiliao.github.io/');
render_author('Yuanqing Zhang');
render_author('Yudian Li');
render_author('Yujiu Yang', 'https://scholar.google.com/citations?user=4gH3sxsAAAAJ');
render_author('Yujun Shen', 'https://shenyujun.github.io/');
render_author('Yuwei Guo', 'https://guoyww.github.io/');
render_author('Yang Zheng', 'https://profiles.stanford.edu/yang-zheng');
render_author('Ze Yang', 'https://www.cs.toronto.edu/~zeyang/');
render_author('Zexiang Xu', 'https://zexiangxu.github.io/');
render_author('Zhaopeng Cui', 'https://zhpcui.github.io/');
render_author('Zhengfei Kuang', 'https://zhengfeikuang.com/');
render_author('Zhirong Wu', 'https://scholar.google.com/citations?user=lH4zgcIAAAAJ');
render_author('Zhiyi Zhang', 'https://www.brando.dev/');
render_author('Zifan Shi', 'https://vivianszf.github.io/');
render_author('Ziwei Liu', 'https://liuziwei7.github.io/');
render_author('Zhiyuan Yu', 'https://fishfishson.github.io/')
render_author('Zhen Xu', 'https://zhenx.me/');
render_author('Zhenjia Xu', 'https://www.zhenjiaxu.com/');
render_author('Lvmin Zhang', 'https://lvminzhang.com/');
render_author('Junfei Xiao', 'https://lambert-x.github.io/');
render_author('Ziyan Yang', 'https://ziyanyang.github.io/');
render_author('Zhenheng Yang', 'https://zhenheny.github.io/');
render_author('Alan Yuille', 'http://www.cs.jhu.edu/~ayuille/');
render_author('Maneesh Agrawala', 'https://graphics.stanford.edu/~maneesh/');
render_author('Lu Jiang', 'http://www.lujiang.info/');
render_author('Shuai Yang', 'https://ys-imtech.github.io/');
render_author('Shuai Yang (RobbyAnt)', 'https://scholar.google.com/citations?user=l5HWdWEAAAAJ&hl=zh-CN', 'Shuai Yang');
render_author('Changan Chen', 'https://changan.io/');
render_author('Yebin Liu', 'https://www.liuyebin.com/');
render_author('Delio Vicini', 'https://dvicini.github.io/');
render_author('Yuxiao Zhou', 'https://calciferzh.github.io/');
render_author('Thabo Beeler', 'https://thabobeeler.com/');
render_author('Shanchuan Lin', 'https://scholar.google.com/citations?user=EDWUw7gAAAAJ');
render_author('Meng Wei', 'https://scholar.google.com/citations?user=Wx8ChLcAAAAJ&hl=en');
render_author('Liangke Gui', 'https://scholar.google.com/citations?hl=en&user=oM6Pj3MAAAAJ');
render_author('Qi Zhao', 'https://scholar.google.com/citations?user=9keFNTMAAAAJ&hl=en');
render_author('Ka Leong Cheng', 'https://kaleongcheng.github.io/');

// New authors for CausalWM, OpenWM, MDM
render_author('Lin Li');
render_author('Yiming Luo', 'https://ymluo1214.github.io/');
render_author('Ruilin Wang');
render_author('Fei Han');
render_author('Mingrui Yu', 'https://mingrui-yu.github.io/');
render_author('Zelin Gao', 'https://zelingao98.github.io/');
render_author('Xing Zhu', 'https://scholar.google.com/citations?user=Hnh87z4AAAAJ&hl=en');
render_author('Boyu Zhou', 'https://boyuzhou.net/');
render_author('Mingyu Ding', 'https://dingmyu.github.io/');
render_author('Robbyant Team');
render_author('Yanhong Zeng', 'https://zengyh1900.github.io/');
render_author('Yixuan Li');
render_author('Hanlin Wang');
render_author('Shuailei Ma', 'https://scholar.google.com/citations?hl=en&user=TdOvhxcAAAAJ');
render_author('Yihang Chen', 'https://sh17c.top/');
render_author('Jie Liu');
render_author('Yansong Cheng');
render_author('Yao Yao', 'https://yoyo000.github.io/');
render_author('Jiayi Zhu');
render_author('Yihao Meng', 'https://yihao-meng.github.io/');
render_author('Jingye Chen', 'https://jingyechen.github.io/');
render_author('Zehong Shen', 'https://zehongs.github.io/');
render_author('Yue Yu');
render_author('Bin Tan', 'https://icetttb.github.io/');
render_author('Changjiang Sun');
render_author('Xiage Qin');
render_author('Hanat Adai');
render_author('Zelin Fu');
render_author('Tianxiang Zhou');
render_author('Han Zhang');
render_author('Yunnan Wang', 'https://wangyunnan.github.io/');
render_author('Minghao Chen', 'https://silent-chen.github.io/');
render_author('David Novotny', 'https://d-novotny.github.io/');
render_author('Wenjun Zeng', 'https://scholar.google.com/citations?user=_cUfvYQAAAAJ');
render_author('Xin Jin', 'https://srameo.github.io/');
render_author('Wen Wang', 'https://encounter1997.github.io/');
render_author('Zichen Liu', 'https://zichenliu.github.io/');
render_author('Linzhuo Chen', 'https://linzhuo.xyz/');
render_author('Jian Gao', 'https://ygaojiany.github.io/');
render_author('Yipengjing Sun');
render_author('Liangxiao Hu');

// New authors for GA-VLN
render_author('Jiahao Yang');
render_author('Zihan Wang');
render_author('Xiangyang Li');
render_author('Shuqiang Jiang', 'https://vipl.ict.ac.cn/people/_sqjiang/');

// New authors for RepWAM / Next Forcing
render_author('Gangwei Xu', 'https://gangweix.github.io/');
render_author('Jiaming Zhou');
render_author('Xin Yang');
render_author('Junke Wang', 'https://wdrink.github.io/');
render_author('Zuxuan Wu');
render_author('Yu-Gang Jiang');
// RepWAM's Shuai Yang is a different person from VWM's (ys-imtech); disambiguate via alias
render_author('Shuai Yang (RepWAM)', 'https://yangs03.github.io/', 'Shuai Yang');

// New authors for LingBot 2026 releases
render_author('Shaohui Liu');
render_author('Wei Wu');
render_author('Xinyang Wang');
render_author('Jiahao Wang');
render_author('Yufeng Yuan');
render_author('Yichong Lu');
render_author('Haojie Zhang');
render_author('Tianrui Feng');
render_author('Yuzheng Liu');
render_author('Jiaqi Liao', 'https://curryx-001.github.io/');
render_author('Jingjing Wang');
render_author('Chaoran Feng');
render_author('Zijing Hu');
render_author('Chong Bao');
render_author('Zichen Xi');
render_author('Yuqi Gan');
render_author('Weisen Wang');
render_author('Qin Zhao');
render_author('Jiahao Shao', 'https://jiahao-shao1.github.io/');
render_author('Lunke Pan');
render_author('Luyao Zhang');
render_author('Shuaiting Li');
render_author('Yishu Shen', 'https://sys111111.github.io/');
render_author('Yudong Jin', 'https://github.com/krahets');
render_author('Fangyi Xu');
render_author('Guanxing Lu');
render_author('Yongkun Wen');
render_author('Yujie Zhao');
render_author('Weixuan Tang');
render_author('Chaojian Li');
render_author('Haibin Shen');
render_author('Haotong Qin');
render_author('Cunxin Fan');
render_author('Junwei Liang');
render_author('Tao Xie');
render_author('Yuanbo Yang');
render_author('Seungjun Lee');
render_author('Gim Hee Lee');
render_author('Tianhong Gao');
render_author('Cheng Yu');
render_author('Mengyu Chu');
