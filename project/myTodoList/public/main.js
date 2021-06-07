//list loading
async function getList(){
	try{
		const res=await axios.get('/lists');
		const lists=res.data;
		console.log(lists);
		const tbody=document.querySelector('#todo-list tbody');
		tbody.innerHTML='';
		lists.map(function(list){
			const row=document.createElement('tr');
			let td=document.createElement('td');
			td.textContent=list.content;
			row.appendChild(td);
			td=document.createElement('td');
			td.textContent=list.date;
			row.appendChild(td);
			td=document.createElement('td');
			td.textContent=list.done ? '완료':'미완료';
			row.appendChild(td);
			const edit=document.createElement('button');
			edit.textContent='수정';
			edit.addEventListener('click', async()=>{
				const newList=prompt('수정 내용을 입력하세요.');
				if(!newList){
					return alert('내용을 입력하셔야 합니다.');
				}
				try{
					await axios.patch(`/lists/${list._id}`, {list:newList});
					getList();
				}catch(err){
					console.error(err);
				}
			});
			const remove=document.createElement('button');
			remove.textContent='삭제';
			remove.addEventListener('click', async()=>{
				try{
					await axios.delete(`/lists/${list._id}`);
					getList();
				}catch(err){
					console.error(err);
				}
			});
			td=document.createElement('td');
			td.appendChild(edit);
			row.appendChild(td);
			td=document.createElement('td');
			td.appendChild(remove);
			row.appendChild(td);
			tbody.appendChild(row);
		});
	}catch(err){
		console.error(err);
	}
}

document.getElementById('list-form').addEventListener('submit', async (e)=>{
	e.preventDefault();
	const content=e.target.content.value;
	console.log(content);
	const today = new Date();   
	const date=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	const done=false;
	if(!content){
		return alert('할 일을 입력하세요.');
	}
	try{
		await axios.post('/lists', {content, date, done});
		getList();
	}catch(err){
		console.error(err);
	}
	e.target.content.value="";
});

getList();