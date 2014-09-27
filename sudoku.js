$(document).ready(function() {
	$active = "";
	
	$('td').click( function() {
		$('td').css('background', '#fff');
		$(this).css('background', '#aaa');
		$active = $(this).children('div');
	});

	$("#go").click( function() {
		solveit();
	});
	
	$("#reset").click( function() {
		$("#sudoku_table>tbody>tr>td>div").text("");
	});
  
	$('body').keypress(function (event) {
		if ($active == "")
			$active = $("#sudoku_table>tbody>tr:first>td:first").children("div");

		if (event.which >= 48 && event.which <= 57)
				$active.text(String.fromCharCode(event.which));
			else
				$active.text("");

		$active.parent('td').css('background', '#fff');
		if ($active.parent('td').next('td').length > 0)
		{
			$active.parent('td').next('td').css('background','#aaa');
			$active = $active.parent('td').next('td').children('div');
		}
		else
		{
			$active.parent('td').parent('tr').next('tr').children('td:first').css('background','#aaa');
			$active = $active.parent('td').parent('tr').next('tr').children('td:first').children('div');
		}
	});
    
	var sudoku = [];
	var helper = [];

	function solveit()
	{
		if ($active != "")
			$active.parent('td').css('background', '#fff');
	
		for(var i = 0; i <= 8 ; i++)
		{
			sudoku[i] = [];
			helper[i] = [];
			for(var j = 0; j <= 8 ; j++)
			{
				$current_value = $("#cel"+i.toString()+j.toString()).text();
				var element = {
					type: "Z",
					virgin: "Y",
					nietgetest: [1,2,3,4,5,6,7,8,9]
				}
				if ($current_value.length > 0)
				{
					sudoku[i][j] = parseInt($current_value);
					$("#cel"+i.toString()+j.toString()).parent('td').css('background', '#EEEEEE');
					element.type = "I";
				} 
				else
				{
					sudoku[i][j] = 0;
					element.type = "Z";
				}
				helper[i][j] = element;
			}
		}
		
		if (!InputValidation())
		{
		
			alert("Fouten in opgave");
		}
		else
		{
			for(var i = 0; i <= 8 ; i++)
			{
				for(var j = 0; j <= 8 ; j++)
				{
					if (helper[i][j].type == "Z")
					{
						if (SolveThisOne(i, j) == false)
						{
							ResetCurrent(i, j);
							do
							{
								if (j == 0)
								{
									if (i == 0)
									{
										alert("Deze kan niet opgelost worden!");
										break;
									}
									else
									{
										j = 8;
										i = i - 1;
									}
								}
								else
								{
									j = j - 1;
								}
							}
							while (helper[i][j].type != "Z")
							j--;
						}
					}
				}
			}
		}
	}
      
	function InputValidation()
	{
		for (var i = 0; i <= 8; i++)
		{
			for (var j = 0; j <= 8; j++)
			{
				if (helper[i][j].type == "I")
				{
					for (var x = 0; x <= 8; x++)
					{
						if (j != x && sudoku[i][j] == sudoku[i][x])
							return false;
						if (i != x && sudoku[i][j] == sudoku[x][j])
							return false;
					}
					a = i % 3;
					b = j % 3;
					for (var tel = i - a; tel < i - a + 3; tel++)
					{
						if (tel == i) continue;
						for(var tel2 = j - b; tel2 < j - b + 3; tel2++)
						{
							if (tel2 == j) continue;
							if (sudoku[i][j] == sudoku[tel][tel2]) 
								return false;
						}
					}
				}
			}
		}
		return true;
	}

	
	
	function ResetCurrent(x, y)
	{
		helper[x][y].nietgetest = [1,2,3,4,5,6,7,8,9];
		helper[x][y].virgin = "Y";
		sudoku[x][y] = 0;
		$("#cel"+x.toString()+y.toString()).text("");
	}

	function SolveThisOne(x, y)
	{
        if (helper[x][y].virgin == "Y")
        {
            for (var a = 0; a < 9; a++)
            {
                // Verwijder mogelijk uit rij
                var waarde = sudoku[x][a];
                var locatie = helper[x][y].nietgetest.indexOf(waarde);
                if (locatie != -1)
                    helper[x][y].nietgetest.splice(locatie, 1);
                
                // Verwijder mogelijk uit kolom
                waarde = sudoku[a][y];
                locatie = helper[x][y].nietgetest.indexOf(waarde);
                if (locatie != -1)
                    helper[x][y].nietgetest.splice(locatie, 1);
            }
            
            h = x%3;
            v = y%3;
            
            for (var a = x - h; a < x - h + 3; a++)
            {
				if (a == x) continue;
				for (var b = y - v; b < y - v + 3; b++)
				{
					if (b == y) continue;
					var waarde = sudoku[a][b];
					var locatie = helper[x][y].nietgetest.indexOf(waarde);
					if (locatie != -1)
						helper[x][y].nietgetest.splice(locatie, 1);
				}
            }
            helper[x][y].virgin = "N";
        }
		
        if (helper[x][y].nietgetest.length == 0)
        {
          return false;
        }
        else
        {
          sudoku[x][y] = helper[x][y].nietgetest[0];
		  $("#cel"+x.toString()+y.toString()).text(sudoku[x][y]);
          helper[x][y].nietgetest.splice(0,1);
          return true;
        }
    }
      
	function display_array(arrayd)
	{
		var display = [];
		for(var i = 0; i <= 8 ; i++)
		{
			display[i] = arrayd[i].join(" - ");
		}
		alert(display.join("\n"));
	}
});
