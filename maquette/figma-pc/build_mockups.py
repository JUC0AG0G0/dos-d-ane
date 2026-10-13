from pathlib import Path
from html import escape
from math import sin, cos, radians
import xml.etree.ElementTree as ET

ROOT = Path(__file__).parent
FONT = "Segoe UI, Arial, sans-serif"
C = dict(ink="#17352A", muted="#657D71", green="#119F48", bg="#F3FAF6", line="#D8EADE", red="#CF5943", blue="#6096AB")

def rect(x,y,w,h,fill,rx=0,stroke=None,sw=1):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>'
def text(x,y,value,size=16,fill=None,weight=400,anchor=None):
    return f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" fill="{fill or C["ink"]}"'+(f' text-anchor="{anchor}"' if anchor else '')+f'>{escape(value)}</text>'
def circle(x,y,r,fill,stroke=None,sw=1):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>'
def line(x1,y1,x2,y2,color,width=1,dash=None):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}" stroke-linecap="round"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def group(name,body,transform=None):
    return f'<g id="{name}"'+(f' transform="{transform}"' if transform else '')+f'>{body}</g>'
def logo(x,y,size=26):
    return f'<path d="M{x} {y+size*.8}h{size*.18}l{size*.32}-{size*.62} {size*.32} {size*.62}h{size*.18}" fill="none" stroke="{C["green"]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
def expand(x,y):
    return circle(x,y,18,"#FFFFFF",C['line'])+f'<path d="M{x-5} {y+5}l10-10m-7 0h7v7" fill="none" stroke="{C["ink"]}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
def pill(x,y,w,label,fill="#FFFFFF",ink=None,stroke=None):
    return rect(x,y,w,37,fill,18,stroke)+text(x+w/2,y+24,label,13,ink or C['green'],600,"middle")

def desktop():
    s=rect(56,128,1488,822,"#DDE7DF",16)
    s+=text(107,188,"Votre espace de travail",23,"#718678",500)
    s+=group('Document-de-travail',rect(106,219,526,570,"#F6F9F6",17,"#D0DCD2")+rect(106,219,526,47,"#EEF4EF",17)+text(129,248,"Notes du projet",14,"#778C7F",500)+circle(603,242,4,"#BFCDC3")+line(106,266,632,266,"#DDE6DF")+text(140,316,"Préparer la prochaine étape",22,"#8B9E91",600)+''.join(rect(140,350+i*34,430 if i%3!=2 else 305,7,"#DFE8E1",3) for i in range(5))+rect(140,548,194,137,"#E8EFEA",10)+rect(352,548,220,137,"#E8EFEA",10)+text(156,576,"À explorer",13,"#9AADA0")+text(368,576,"Mes idées",13,"#9AADA0"))
    s+=group('Barre-des-taches',rect(56,914,1488,36,"#F7FAF8")+line(56,914,1544,914,"#CADACF")+''.join(rect(738+(i%2)*8,925+(i//2)*8,6,6,"#6A8E77",1) for i in range(4))+rect(779,921,69,23,"#E8F2EA",6)+logo(792,923,18)+text(820,937,"DA",10,"#558D67",600)+text(1449,935,"15:34",12,"#617769",500)+text(1488,935,"FR",10,"#8A9C90"))
    return group('Bureau-PC',s)

def skeleton():
    w,h=458,352
    pts=[(.5,.20),(.48,.176),(.465,.176),(.45,.176),(.52,.176),(.535,.176),(.55,.176),(.427,.208),(.573,.208),(.478,.239),(.522,.239),(.35,.345),(.65,.345),(.28,.48),(.72,.48),(.37,.62),(.63,.62),(.369,.655),(.631,.655),(.394,.653),(.606,.653),(.406,.626),(.594,.626),(.415,.66),(.585,.66),(.34,.79),(.66,.79),(.35,.921),(.65,.921),(.329,.938),(.671,.938),(.397,.945),(.603,.945)]
    a=radians(23)
    for i in range(11):
        px,py=pts[i];dx=(px-.5)*w;dy=(py-.20)*h
        pts[i]=(.5+(dx*cos(a)-dy*sin(a))/w,.20+(dx*sin(a)+dy*cos(a))/h)
    pts=[(round(x*w,2),round(y*h,2)) for x,y in pts]
    s=rect(0,0,w,h,"#FFFFFF",18,C['line'])
    s+=line(48,247,408,247,"#E4ECE7",8)+line(81,251,81,322,"#E4ECE7",8)+line(377,251,377,322,"#E4ECE7",8)
    s+=f'<ellipse cx="229" cy="72" rx="39" ry="42" transform="rotate(23 229 72)" fill="#FBE1D8"/>'
    s+=f'<path d="M160 122Q229 104 298 122L268 231Q229 250 190 231Z" fill="#E0F5E7"/>'
    for a,b in [(11,13),(13,15),(12,14),(14,16),(23,25),(25,27),(24,26),(26,28)]:
        s+=line(*pts[a],*pts[b],"#E0EEF0",21)
    s+=line(160,121,298,121,"#A2C5B0",1.2,"4 6")+line(229,123,229,269,"#A2C5B0",1.2,"4 6")+line(184,61,274,61,"#E3B9AD",1.2,"4 6")
    edges=[(0,1),(1,2),(2,3),(3,7),(0,4),(4,5),(5,6),(6,8),(9,10),(11,12),(11,13),(13,15),(15,17),(15,19),(15,21),(17,19),(12,14),(14,16),(16,18),(16,20),(16,22),(18,20),(11,23),(12,24),(23,24),(23,25),(25,27),(27,29),(29,31),(27,31),(24,26),(26,28),(28,30),(30,32),(28,32)]
    for a,b in edges:
        color=C['red'] if a<11 and b<11 else C['green'] if a in [11,12,23,24] and b in [11,12,23,24] else C['blue']
        s+=line(*pts[a],*pts[b],color,2.2)
    for i,(x,y) in enumerate(pts):
        color=C['red'] if i<11 else C['green'] if i in [11,12,23,24] else C['blue']
        r=2.6 if i<11 or i in [17,18,19,20,21,22,29,30,31,32] else 4.3
        s+=circle(x,y,r,"#FFFFFF",color,1.9)
    s+=rect(14,13,89,25,"#EFFAF2",13,"#CBE9D6")+text(26,30,"Vue de face",11,"#337B4C")+circle(378,25,3.5,C['green'])+text(388,29,"En direct",10,"#337B4C")
    s+=rect(20,79,71,29,"#FFF1EB",14,"#F3C7B8")+text(33,99,"Tête 23°",12,C['red'],600)+rect(317,190,119,29,"#F1FBF4",14,"#C5E9D0")+text(332,210,"Buste stable · 0°",11,C['green'],500)
    return group('Squelette-33-points',s)

def full_app():
    s=rect(8,12,850,680,"#CBD8CE",24)+rect(0,0,850,680,C['bg'],24,"#C9DFD0")
    s+=group('Barre-de-titre',logo(23,12)+text(61,34,"Dos d’âne",17,weight=650)+text(168,34,"Votre posture, au quotidien",11,C['muted'])+circle(812,27,15,"#FFFFFF",C['line'])+line(806,27,818,27,C['ink'],1.7)+line(0,54,850,54,C['line']))
    s+=group('Entete-session',text(26,82,"Session en cours",12,C['muted'])+text(26,109,"Votre posture, en direct",25,weight=650)+rect(723,74,101,32,"#FFFFFF",16,C['line'])+circle(740,90,3.5,C['green'])+text(753,95,"12:34",14,C['muted'],500))
    s+=group('Camera',skeleton(),"translate(26 130)")
    s+=group('Options-camera',rect(27,496,13,13,C['green'],3)+f'<path d="M30 502l3 3 5-6" stroke="#FFFFFF" stroke-width="1.5" fill="none"/>'+text(47,507,"Afficher l’image caméra",11,C['muted'])+text(484,507,"33 / 33 points visibles",10,C['muted'],anchor="end"))
    labels=[(31,"Stable",C['green']),(107,"À surveiller","#B87616"),(217,"À ajuster",C['red']),(310,"Points suivis",C['blue'])]
    s+=group('Legende', ''.join(circle(x,532,3.5,col)+text(x+10,536,lab,10,C['muted']) for x,lab,col in labels))
    s+=text(26,564,"Les couleurs montrent les zones à ajuster.",11,C['muted'])
    right=rect(502,130,322,121,"#FFF2EE",16,"#EFC3B8")+text(520,154,"POSTURE ACTUELLE",10,"#A76A59",600)+text(520,181,"À ajuster",22,"#B9422D",650)+text(520,207,"Votre tête est inclinée sur le côté.",12,C['muted'])+text(520,226,"Revenez doucement au centre.",12,C['muted'])
    right+=rect(502,264,322,181,"#FFFFFF",16,C['line'])
    right+=text(519,289,"Tête",13,weight=600)+text(519,309,"Inclinaison latérale : 23°",11,C['muted'])+text(519,326,"Centrée sur les épaules",10,C['muted'])+text(807,303,"À ajuster",12,C['red'],600,"end")+line(519,339,807,339,"#E4EDE7")
    right+=text(519,361,"Épaules",13,weight=600)+text(519,379,"Inclinaison : 0°",11,C['muted'])+text(807,367,"Stables",12,C['green'],600,"end")+line(519,391,807,391,"#E4EDE7")
    right+=text(519,414,"Buste",13,weight=600)+text(519,432,"Inclinaison latérale : 0°",11,C['muted'])+text(807,420,"Stable",12,C['green'],600,"end")
    right+=rect(502,458,322,56,"#E7F6EC",12)+text(517,480,"Le suivi démarre automatiquement.",11,"#427556")+text(517,498,"Aucun réglage de référence nécessaire.",11,"#427556")
    right+=text(502,543,"Alerte si la posture persiste",11,C['muted'])+rect(729,526,95,28,"#FFFFFF",8,C['line'])+text(741,544,"30 secondes",10,C['ink'])
    s+=group('Details-posture',right)
    s+=group('Pied-session',rect(1,586,848,70,"#FFFFFF")+line(0,586,850,586,C['line'])+circle(28,614,4,C['green'])+text(40,619,"Caméra active · suivi en cours",12,C['muted'])+text(26,639,"Vous pouvez réduire la fenêtre et continuer à travailler.",10,C['muted'])+pill(644,601,180,"Terminer la session",C['green'],"#FFFFFF")+text(26,671,"Maquette · angles latéraux dans l’image · seuils à tester",9,"#82998A"))
    return group('Application-vue-complete',s,"translate(672 212)")

def mini(bad=False):
    s=rect(4,7,348,94,"#C6D5CA",17)+rect(0,0,348,94,C['bg'],17,"#C6DFCE")
    s+=circle(25,47,5,C['red'] if bad else C['green'])+text(44,35,"Dos d’âne",12,C['muted'])+text(44,61,"Posture à ajuster" if bad else "Posture stable",18,weight=600)+expand(315,47)
    return group('Application-minimisee',s,"translate(1166 798)")

def notification():
    s=rect(5,9,412,263,"#CCD5CB",22)+rect(0,0,412,263,"#FFFFFF",22,"#EBC7B8")
    s+=logo(22,19,23)+text(57,40,"Dos d’âne",16,weight=600)+text(378,41,"×",24,C['muted'])+line(22,58,390,58,C['line'])
    s+=circle(29,86,4,C['red'])+text(42,90,"POSTURE À AJUSTER",10,C['red'],650)+text(22,124,"Un petit ajustement ?",23,weight=650)
    s+=text(22,151,"Votre tête reste inclinée depuis 30 secondes.",13,C['muted'])+text(22,174,"Revenez doucement au centre.",13,C['muted'])
    s+=pill(22,203,197,"Voir ma posture",C['green'],"#FFFFFF")+pill(229,203,161,"Plus tard","#FFFFFF",C['green'],"#B8E0C4")
    return group('Notification-posture',s,"translate(1102 513)")

def board(filename,num,title,desc,content):
    s=rect(0,0,1600,1100,"#F4F6F3")
    s+=text(42,51,num,14,"#119F48",700)+text(92,53,title,27,weight=650)+text(92,81,desc,14,"#728578")
    monitor=rect(32,119,1536,885,"#E0E5E0",34)+rect(40,110,1520,880,"#222B27",25)+rect(48,118,1504,841,"#101713",20)+desktop()+circle(800,970,3,"#65786B")
    s+=group('Ecran-PC',monitor)+content
    s+=group('Pied-du-moniteur',f'<path d="M726 990h148l17 58H709Z" fill="#303B34"/>'+rect(638,1046,324,16,"#26332B",8)+rect(653,1062,294,6,"#DCE3DC",3))
    s+=text(1549,1090,"DOS D’ÂNE / MAQUETTE PC",10,"#8B9B8F",500,"end")
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100" role="img" aria-label="{escape(title)}">{s}</svg>'
    ET.fromstring(svg)
    (ROOT/filename).write_text(svg,encoding="utf-8")

board('full-session.svg','01','Le suivi en direct','La fenêtre complète reste dans le coin inférieur droit de l’écran.',full_app())
board('minimized.svg','02','L’essentiel, en un coup d’œil','Une petite fenêtre discrète accompagne le travail.',mini())
board('notification.svg','03','Un rappel au bon moment','Une notification apparaît si la posture à ajuster persiste.',mini(True)+notification())
print('3 SVG vectoriels générés et XML valide.')
